const axios = require('axios')

const getContragents = async() => {
  let contragents = []
  try{
    const res = await axios.get('https://api.moysklad.ru/api/remap/1.2/entity/counterparty', {
      headers: {
        Authorization: 'Bearer 4f1da1b045d1daedf41a5b8a99185127cae79f95'
      }
    })
    contragents = res.data.rows
  }
  catch(err){
    console.log('Ошибка при получении контрагентов', err.message)
  }
  if(contragents.length){
    contragents = contragents.map(contragent => ({
      id: contragent.id,
      name: contragent.name,
      meta: contragent.meta
    }))
  }
  return contragents
}

module.exports = getContragents