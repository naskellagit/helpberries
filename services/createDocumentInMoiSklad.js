const axios = require('axios')

const createDocumentInMoiSklad = async(data, contrAgentId) => {
  const body = {
    organization: {
      meta: {
        href: 'https://api.moysklad.ru/api/remap/1.2/entity/organization/f6c9445f-d4b5-11e6-7a34-5acf002e51bb',
        type: 'organization',
        mediaType: 'application/json'
      }
    },
    agent: {
      meta: {
        href: `https://api.moysklad.ru/api/remap/1.2/entity/counterparty/${contrAgentId}`,
        type: 'counterparty',
        mediaType: 'application/json'
      }
    },
    store: {
      meta: {
        href: 'https://api.moysklad.ru/api/remap/1.2/entity/store/f6cb5e73-d4b5-11e6-7a34-5acf002e51bd',
        type: 'store',
        mediaType: 'application/json'
      }
    },
    positions: data.map(elem => ({
      quantity: +elem.quantity,
      assortment: {
        meta: {
          href: `https://api.moysklad.ru/api/remap/1.2/entity/product/${elem.id}`,
          type: 'product',
          mediaType: 'application/json'
        }
      }
    }))
  }
  const res = await axios.post('https://api.moysklad.ru/api/remap/1.2/entity/customerorder', body, {
    headers: {
      Authorization: 'Bearer 4f1da1b045d1daedf41a5b8a99185127cae79f95',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json'
    }
  })
  return res
}

module.exports = createDocumentInMoiSklad