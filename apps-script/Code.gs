var CONFIG = {
  preferredSheetNames: ["Página1"],
  legacyHeaders: ["Nome", "Filhos", "Vai?", "Mensagem"],
  photoFolderId: "",
  optionalHeaders: {
    adultCompanion: "Acompanhante adulto",
  },
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
    var payload = parseRequestPayload(e);

    if (payload.action === "photoUpload") {
      return handlePhotoUpload(payload);
    }

    validatePayload(payload);

    var sheet = resolveTargetSheet();
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

  var contentType = (e.postData.type || "").toLowerCase();
  var raw = e.postData.contents;

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
    levaAcompanhanteAdulto:
      params.levaAcompanhanteAdulto || params.adultCompanion || "",
    nomeAcompanhanteAdulto:
      params.nomeAcompanhanteAdulto || params.adultCompanionName || "",
    nomesAcompanhantes: params.nomesAcompanhantes || "",
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
  var spreadsheet = getSpreadsheet();
  var explicitSheetName =
    PropertiesService.getScriptProperties().getProperty("SHEET_NAME");
  var candidates = explicitSheetName
    ? [explicitSheetName]
    : CONFIG.preferredSheetNames;

  for (var i = 0; i < candidates.length; i++) {
    var sheet = spreadsheet.getSheetByName(candidates[i]);

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
  var headers = getHeaderValues(sheet, CONFIG.legacyHeaders.length);

  var matches = CONFIG.legacyHeaders.every(function(header, index) {
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
  var row = sheet.getRange(1, 1, 1, columnCount).getValues()[0];

  return row.map(function(value) {
    return String(value || "").trim();
  });
}

function appendLegacyRow(sheet, payload) {
  var adultCompanionName = getAdultCompanionName(payload);
  var hasAdultCompanionColumn = hasHeader(
    sheet,
    CONFIG.optionalHeaders.adultCompanion
  );
  var messageValue = payload.mensagemAosNoivos || "";

  if (!hasAdultCompanionColumn) {
    messageValue = buildMessage(payload.mensagemAosNoivos, adultCompanionName);
  }

  var row = [
    payload.nomeCompleto || "",
    Number(payload.quantidadeAcompanhantes || 0),
    normalizePresence(payload.presenca),
    messageValue,
  ];

  appendByHeaders(sheet, CONFIG.legacyHeaders, row);
  appendOptionalAdultCompanion(sheet, adultCompanionName);
}

function appendByHeaders(sheet, expectedHeaders, values) {
  var headers = getHeaderValues(sheet, sheet.getLastColumn());
  var nextRow = sheet.getLastRow() + 1;

  expectedHeaders.forEach(function(header, index) {
    var columnIndex = headers.indexOf(header);

    if (columnIndex === -1) {
      throw new Error('Coluna obrigatória não encontrada: "' + header + '".');
    }

    sheet.getRange(nextRow, columnIndex + 1).setValue(values[index]);
  });
}

function normalizePresence(value) {
  var normalized = String(value || "").trim().toLowerCase();

  if (normalized === "sim" || normalized === "yes") {
    return "yes";
  }

  if (normalized === "não" || normalized === "nao" || normalized === "no") {
    return "no";
  }

  return value || "";
}

function getAdultCompanionName(payload) {
  if (payload.nomeAcompanhanteAdulto) {
    return String(payload.nomeAcompanhanteAdulto).trim();
  }

  if (Array.isArray(payload.nomesAcompanhantes) && payload.nomesAcompanhantes.length) {
    return String(payload.nomesAcompanhantes[0] || "").trim();
  }

  return "";
}

function buildMessage(message, adultCompanionName) {
  var normalizedMessage = String(message || "").trim();

  if (!adultCompanionName) {
    return normalizedMessage;
  }

  var companionLine = "Acompanhante adulto: " + adultCompanionName;

  if (!normalizedMessage) {
    return companionLine;
  }

  return normalizedMessage + "\n" + companionLine;
}

function appendOptionalAdultCompanion(sheet, adultCompanionName) {
  var headers = getHeaderValues(sheet, sheet.getLastColumn());
  var columnIndex = headers.indexOf(CONFIG.optionalHeaders.adultCompanion);

  if (columnIndex === -1) {
    return;
  }

  sheet.getRange(sheet.getLastRow(), columnIndex + 1).setValue(adultCompanionName || "");
}

function hasHeader(sheet, header) {
  var headers = getHeaderValues(sheet, sheet.getLastColumn());
  return headers.indexOf(header) !== -1;
}

function getSpreadsheet() {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty(
    "SPREADSHEET_ID"
  );

  if (spreadsheetId) {
    return SpreadsheetApp.openById(spreadsheetId);
  }

  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

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

function handlePhotoUpload(payload) {
  var folderId = CONFIG.photoFolderId;

  if (!folderId) {
    folderId = PropertiesService.getScriptProperties().getProperty(
      "PHOTO_FOLDER_ID"
    );
  }

  if (!folderId) {
    throw new Error("ID da pasta de fotos não configurado no Code.gs.");
  }

  if (!payload.photos || !Array.isArray(payload.photos) || !payload.photos.length) {
    throw new Error("Nenhuma foto recebida.");
  }

  var folder = DriveApp.getFolderById(folderId);
  var guestName = sanitizeFilePart(payload.guestName || "convidado");
  var savedFiles = [];

  for (var i = 0; i < payload.photos.length; i++) {
    var photo = payload.photos[i];

    if (!photo || !photo.data || !photo.mimeType) {
      continue;
    }

    if (String(photo.mimeType).indexOf("image/") !== 0) {
      continue;
    }

    var bytes = Utilities.base64Decode(photo.data);
    var extension = extensionFromMimeType(photo.mimeType);
    var originalName = sanitizeFilePart(photo.fileName || "foto");
    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyyMMdd-HHmmss"
    );
    var fileName =
      timestamp + "-" + guestName + "-" + (i + 1) + "-" + originalName;

    if (fileName.toLowerCase().lastIndexOf(extension) !== fileName.length - extension.length) {
      fileName += extension;
    }

    var blob = Utilities.newBlob(bytes, photo.mimeType, fileName);
    var file = folder.createFile(blob);

    savedFiles.push({
      id: file.getId(),
      name: file.getName(),
      url: file.getUrl(),
    });
  }

  if (!savedFiles.length) {
    throw new Error("Nenhuma foto válida foi salva.");
  }

  return jsonResponse({
    ok: true,
    message: "Fotos salvas com sucesso.",
    count: savedFiles.length,
    files: savedFiles,
  });
}

function sanitizeFilePart(value) {
  return String(value || "")
    .trim()
    .replace(/[^\wÀ-ÿ.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60) || "foto";
}

function extensionFromMimeType(mimeType) {
  if (mimeType === "image/png") {
    return ".png";
  }

  if (mimeType === "image/webp") {
    return ".webp";
  }

  return ".jpg";
}
