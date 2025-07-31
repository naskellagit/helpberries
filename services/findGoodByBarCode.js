const axios = require('axios')

const findGoodByBarCode = async(barCode) => {
  try{
    const res = await axios.get('https://api.moysklad.ru/api/remap/1.2/entity/product', {
      headers: {
        Authorization: 'Bearer 4f1da1b045d1daedf41a5b8a99185127cae79f95'
      },
      params: {
        filter: `barcode=${barCode}`
      }
    })
    return res.data.rows[0]
  }
  catch(err){
    console.log('Ошибка при нахождении товара', err.message)
  }
}

module.exports = findGoodByBarCode