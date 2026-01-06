function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("RSVP");
    if (!sheet) {
      sheet = spreadsheet.insertSheet("RSVP");
      sheet.appendRow([
        "Timestamp",
        "Nome",
        "Presenca",
        "Quantidade",
        "Acompanhantes",
        "WhatsApp",
        "Restricoes",
        "Mensagem"
      ]);
    }
    sheet.appendRow([
      new Date(),
      data.nomeCompleto || "",
      data.presenca || "",
      data.quantidadeAcompanhantes || 0,
      (data.nomesAcompanhantes || []).join(", "),
      data.telefoneWhatsapp || "",
      data.restricoesAlimentares || "",
      data.mensagemAosNoivos || ""
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
