const CONFIG = {
  sheetName: "RSVP",
  headers: [
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

    const sheet = getOrCreateSheet();
    sheet.appendRow([
      new Date(),
      payload.nomeCompleto || "",
      payload.presenca || "",
      Number(payload.quantidadeAcompanhantes || 0),
      normalizeCompanions(payload.nomesAcompanhantes),
      payload.telefoneWhatsapp || "",
      payload.restricoesAlimentares || "",
      payload.mensagemAosNoivos || "",
    ]);

    return jsonResponse({
      ok: true,
      message: "Confirmação salva com sucesso.",
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

function getOrCreateSheet() {
  const spreadsheet = getSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.sheetName);
  }

  ensureHeaders(sheet);
  return sheet;
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

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CONFIG.headers);
    return;
  }

  const currentHeaders = sheet
    .getRange(1, 1, 1, CONFIG.headers.length)
    .getValues()[0];

  const headersMatch = CONFIG.headers.every(function(header, index) {
    return currentHeaders[index] === header;
  });

  if (!headersMatch) {
    sheet
      .getRange(1, 1, 1, CONFIG.headers.length)
      .setValues([CONFIG.headers]);
  }
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
