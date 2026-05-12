const CONFIG = {
  preferredSheetNames: ["Página1"],
  legacyHeaders: ["Nome", "Filhos", "Vai?", "Mensagem"],
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

    const sheet = resolveTargetSheet();
    appendLegacyRow(sheet, payload);

    return jsonResponse({
      ok: true,
      message: 'Confirmação salva com sucesso na aba "' + sheet.getName() + '".',
      sheet: sheet.getName(),
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
    : CONFIG.preferredSheetNames;

  for (var i = 0; i < candidates.length; i++) {
    const sheet = spreadsheet.getSheetByName(candidates[i]);

    if (!sheet) {
      continue;
    }

    ensureLegacyHeaders(sheet);
    return sheet;
  }

  throw new Error(
    'Aba de destino não encontrada. Defina a Script Property SHEET_NAME ou use uma aba chamada "' +
      CONFIG.preferredSheetNames[0] +
      '".'
  );
}

function ensureLegacyHeaders(sheet) {
  const headers = getHeaderValues(sheet, CONFIG.legacyHeaders.length);

  const matches = CONFIG.legacyHeaders.every(function(header, index) {
    return headers[index] === header;
  });

  if (!matches) {
    throw new Error(
      'A aba "' +
        sheet.getName() +
        '" não está no formato esperado. Cabeçalhos esperados: ' +
        CONFIG.legacyHeaders.join(", ")
    );
  }
}

function getHeaderValues(sheet, columnCount) {
  const row = sheet.getRange(1, 1, 1, columnCount).getValues()[0];

  return row.map(function(value) {
    return String(value || "").trim();
  });
}

function appendLegacyRow(sheet, payload) {
  const row = [
    payload.nomeCompleto || "",
    Number(payload.quantidadeAcompanhantes || 0),
    normalizePresence(payload.presenca),
    payload.mensagemAosNoivos || "",
  ];

  appendByHeaders(sheet, CONFIG.legacyHeaders, row);
}

function appendByHeaders(sheet, expectedHeaders, values) {
  const headers = getHeaderValues(sheet, sheet.getLastColumn());
  const nextRow = sheet.getLastRow() + 1;

  expectedHeaders.forEach(function(header, index) {
    const columnIndex = headers.indexOf(header);

    if (columnIndex === -1) {
      throw new Error('Coluna obrigatória não encontrada: "' + header + '".');
    }

    sheet.getRange(nextRow, columnIndex + 1).setValue(values[index]);
  });
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

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
