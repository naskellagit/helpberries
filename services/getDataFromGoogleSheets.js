const getDataFromGoogleSheets = async(client, google, spreadsheetId, sheetName) => {
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:G`,
  });

  let rows = response.data.values || [];

  // Преобразовать в объекты
  const data = rows.map(r => ({
    id: r[0],
    date: r[1],
    boxCode: r[2],
    productCode: r[3],
    boxNumber: r[4],
    quantity: r[5],
    deleted: r[6]
  }));
  return data
}

module.exports = getDataFromGoogleSheets