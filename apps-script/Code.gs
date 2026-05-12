const CONFIG = {
  preferredSheetNames: ["Página1"],
  legacyHeaders: ["Nome", "Filhos", "Vai?", "Mensagem"],
  detailedHeaders: [
    "Timestamp",
    "Nome",
    "Presenca",
    "Quantidade",
    "Acompanhantes",
    "WhatsApp",
    "Restricoes",
    "Mensagem",
  ],
};

function doGet() {
  return jsonResponse({
    ok: true,
    message: "RSVP web app online.",
    timestamp: new Date().toISOString(),
  });
}

function doPost(e) {
  try {
    const payload = parseRequestPayload(e);
    validatePayload(payload);

    const target = resolveTargetSheet();
    target.sheet.appendRow(buildRow(target.mode, payload));

    return jsonResponse({
      ok: true,
      message: 'Confirmação salva com sucesso na aba "' + target.sheet.getName() + '".',
      sheet: target.sheet.getName(),
      mode: target.mode,
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      message: error.message || String(error),
    });
  }
}

function parseRequestPayload(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Requisição sem corpo.");
  }

  const contentType = (e.postData.type || "").toLowerCase();
  const raw = e.postData.contents;

  if (contentType.indexOf("application/json") !== -1) {
    return JSON.parse(raw);
  }

  if (contentType.indexOf("application/x-www-form-urlencoded") !== -1) {
    return fromParameterObject(e.parameter || {});
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return fromParameterObject(e.parameter || {});
  }
}

function fromParameterObject(params) {
  return {
    nomeCompleto: params.nomeCompleto || params.name || "",
    presenca: params.presenca || params.attendance || "",
    quantidadeAcompanhantes:
      params.quantidadeAcompanhantes || params.guests || "0",
    nomesAcompanhantes: splitCompanions(
      params.nomesAcompanhantes || params.companions || ""
    ),
    telefoneWhatsapp: params.telefoneWhatsapp || params.whatsapp || "",
    restricoesAlimentares:
      params.restricoesAlimentares || params.restricoes || "",
    mensagemAosNoivos: params.mensagemAosNoivos || params.notes || "",
  };
}

function validatePayload(payload) {
  if (!payload.nomeCompleto || !String(payload.nomeCompleto).trim()) {
    throw new Error("Nome completo é obrigatório.");
  }

  if (!payload.presenca || !String(payload.presenca).trim()) {
    throw new Error("Presença é obrigatória.");
  }
}

function resolveTargetSheet() {
  const spreadsheet = getSpreadsheet();
  const explicitSheetName =
    PropertiesService.getScriptProperties().getProperty("SHEET_NAME");
  const candidates = explicitSheetName
    ? [explicitSheetName]
    : CONFIG.preferredSheetNames.concat(getSheetNames(spreadsheet));

  for (var i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const sheet = spreadsheet.getSheetByName(candidate);

    if (!sheet) {
      continue;
    }

    const mode = detectSheetMode(sheet);
    if (mode) {
      return { sheet: sheet, mode: mode };
    }
  }

  throw new Error(
    'Nenhuma aba compatível encontrada. Configure a Script Property SHEET_NAME com a aba correta ou use uma aba com cabeçalhos "' +
      CONFIG.legacyHeaders.join(", ") +
      '" ou "' +
      CONFIG.detailedHeaders.join(", ") +
      '".'
  );
}

function detectSheetMode(sheet) {
  const headers = getHeaderValues(sheet);

  if (matchesHeaders(headers, CONFIG.legacyHeaders)) {
    return "legacy";
  }

  if (matchesHeaders(headers, CONFIG.detailedHeaders)) {
    return "detailed";
  }

  return null;
}

function getHeaderValues(sheet) {
  const maxColumns = Math.max(
    CONFIG.legacyHeaders.length,
    CONFIG.detailedHeaders.length
  );
  const row = sheet.getRange(1, 1, 1, maxColumns).getValues()[0];

  return row.map(function(value) {
    return String(value || "").trim();
  });
}

function matchesHeaders(currentHeaders, expectedHeaders) {
  return expectedHeaders.every(function(header, index) {
    return currentHeaders[index] === header;
  });
}

function buildRow(mode, payload) {
  if (mode === "legacy") {
    return [
      payload.nomeCompleto || "",
      Number(payload.quantidadeAcompanhantes || 0),
      normalizePresence(payload.presenca),
      payload.mensagemAosNoivos || "",
    ];
  }

  return [
    new Date(),
    payload.nomeCompleto || "",
    payload.presenca || "",
    Number(payload.quantidadeAcompanhantes || 0),
    normalizeCompanions(payload.nomesAcompanhantes),
    payload.telefoneWhatsapp || "",
    payload.restricoesAlimentares || "",
    payload.mensagemAosNoivos || "",
  ];
}

function normalizePresence(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "sim" || normalized === "yes") {
    return "yes";
  }

  if (normalized === "não" || normalized === "nao" || normalized === "no") {
    return "no";
  }

  return value || "";
}

function getSheetNames(spreadsheet) {
  return spreadsheet.getSheets().map(function(sheet) {
    return sheet.getName();
  });
}

function getSpreadsheet() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty(
    "SPREADSHEET_ID"
  );

  if (spreadsheetId) {
    return SpreadsheetApp.openById(spreadsheetId);
  }

  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (!activeSpreadsheet) {
    throw new Error(
      "Planilha não encontrada. Defina a Script Property SPREADSHEET_ID ou vincule o script à planilha."
    );
  }

  return activeSpreadsheet;
}

function normalizeCompanions(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }

  return value || "";
}

function splitCompanions(value) {
  if (!value) {
    return [];
  }

  return String(value)
    .split(",")
    .map(function(item) {
      return item.trim();
    })
    .filter(Boolean);
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
