const express = require('express')
const router = express.Router()
const { google } = require('googleapis')
const getDataFromGoogleSheets = require('./services/getDataFromGoogleSheets')
const createDocumentInMoiSklad = require('./services/createDocumentInMoiSklad')
const contragentsFilter = require('./services/contragentsFilter')

const spreadsheetId = '1oSZDceUo1RMIAtzRRgUVVeSG6O9i-Fp47oY8t2I5nZo'
const sheetName = 'Sheet1'

const keys = require('./credentials.json')
const getContragents = require('./services/getContragents')
const findGoodByBarCode = require('./services/findGoodByBarCode')
const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

router.get('/rows', async(req, res) => {
  const client = await auth.getClient()
  let data = await getDataFromGoogleSheets(client, google, spreadsheetId, sheetName)

  // ----------------
  // ✅ Фильтрация
  // ----------------
  const { id, date, boxCode, productCode, quantity, boxNumber, deleted } = req.query;

  const boxesCount = Math.max(...data.map(el => el.boxNumber))

  if (id) {
    data = data.filter(item => item.id === id)
  }
  if (date) {
    data = data.filter(item => item.date === date)
  }
  if (boxCode) {
    data = data.filter(item => item.boxCode === boxCode)
  }
  if (productCode) {
    data = data.filter(item => item.productCode === productCode)
  }
  if (quantity) {
    data = data.filter(item => item.quantity === quantity)
  }
  if (boxNumber) {
    data = data.filter(item => item.boxNumber === boxNumber)
  }
  if (deleted) {
    data = data.filter(item => item.deleted === deleted)
  }

  // ----------------
  // ✅ Сортировка
  // ----------------
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

  if (sortField) {
    data.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // ----------------
  // ✅ Пагинация
  // ----------------
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || data.length;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedData = data.slice(startIndex, endIndex);

  res.send({
    page,
    limit,
    total: data.length,
    data: paginatedData,
    boxesCount
  });
})

router.get('/row/:id', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:G`,
  });

  const rows = response.data.values || [];
  const row = rows.find(r => r[0] === req.params.id);

  if (row) {
    res.send({
      id: row[0],
      date: row[1],
      boxCode: row[2],
      productCode: row[3],
      boxNumber: row[4],
      quantity: row[5],
      deleted: r[6]
    });
  } else {
    res.status(404).send({ message: 'Row not found' });
  }
})

router.post('/row', async (req, res) => {
  const { id, date, boxCode, productCode, quantity, boxNumber, deleted } = req.body;

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:G`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[id, date, boxCode, productCode, boxNumber, quantity, deleted]],
    },
  });

  res.send({ message: 'Row added' });
})

router.put('/row/:id', async (req, res) => {
  const { id, date, boxCode, productCode, quantity, boxNumber, deleted } = req.body;

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:G`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(r => r[0] === req.params.id);

  if (rowIndex === -1) {
    return res.status(404).send({ message: 'Row not found' });
  }

  // +2, потому что A2 = index 0, и плюс 1 для заголовка
  const range = `${sheetName}!A${rowIndex + 2}:G${rowIndex + 2}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[id, date, boxCode, productCode, boxNumber, quantity, deleted]],
    },
  });

  res.send({ message: 'Row updated' });
})

router.delete('/row/:id', async (req, res) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:G`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(r => r[0] === req.params.id);

  if (rowIndex === -1) {
    return res.status(404).send({ message: 'Row not found' });
  }

  // Удалить строку через batchUpdate
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0, // ID листа (Sheet1 обычно = 0, если нужно — могу показать, как найти)
              dimension: 'ROWS',
              startIndex: rowIndex + 1, // +1, потому что первая строка — заголовки
              endIndex: rowIndex + 2,
            },
          },
        },
      ],
    },
  });

  res.send({ message: 'Row deleted' });
})

router.get('/contragents', async(req, res) => {
  const conrtagents = await getContragents()
  // Фильтруем контрагентов только по OOO и ИП
  const filteredContragents = contragentsFilter(conrtagents)
  res.json(filteredContragents)
})

router.post('/moiSklad', async(req, res) => {
  const client = await auth.getClient()
  let data = await getDataFromGoogleSheets(client, google, spreadsheetId, sheetName)
  data = data.filter(el => el.deleted === 'FALSE')
  const boxesCodes = []
  data.forEach(el => {
    const findedElem = boxesCodes.find(item => item === el.boxCode)
    if(!findedElem){
      boxesCodes.push(el.boxCode)
    }
  })
  const resultData = []
  data.forEach(item => {
    const findedElem = resultData.find(el => el.productCode === item.productCode)
    if(!findedElem) resultData.push({
      productCode: item.productCode,
      quantity: item.quantity
    })
    else{
      findedElem.quantity = (+item.quantity + +findedElem.quantity).toString()
    }
  })
  const promises = []
  const findedGoods = []
  resultData.forEach((item) => {
    promises.push(findGoodByBarCode(item.productCode).then(res => {
      if(res) findedGoods.push({...res, quantity: item.quantity})
    }))
  })
  await Promise.all(promises)
  let response = null
  try{
    response = await createDocumentInMoiSklad(findedGoods, req.body.id, boxesCodes)
    response = response.data.meta.uuidHref
  }
  catch(err){
    response = {error: err.response.data.errors[0].error}
  }
  return res.json(response)
})

module.exports = router;