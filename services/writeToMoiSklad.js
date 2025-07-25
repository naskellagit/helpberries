const axios = require('axios')

const writeToMoiSklad = async(data) => {
  const bodyForUpdate = []
  // Получаем все товары из моего склада из папки Сканирование
  try{
    const res = await axios.get('https://api.moysklad.ru/api/remap/1.2/entity/product?filter=pathName=Сканирование', {
      headers: {
        Authorization: 'Bearer 4f1da1b045d1daedf41a5b8a99185127cae79f95'
      }
    })
    const goods = res.data.rows
    // Обновляем товары
    data.forEach(elem => {
      // Находим товар, если существует
      const findedGood = goods.find(el => el.code === elem.id)
      if(findedGood){
        bodyForUpdate.push({
          meta: {
            href: `https://api.moysklad.ru/api/remap/1.2/entity/product/${findedGood.id}`,
            metadataHref: 'https://api.moysklad.ru/api/remap/1.2/entity/product/metadata',
            type: 'product',
            mediaType: 'application/json'
          },
          description: elem.quantity + ' шт.'
        })
      }
      else{
        bodyForUpdate.push({
          name: elem.productCode,
          code: elem.id,
          description: elem.quantity + ' шт.',
          barcodes: [
            {
              ean13: elem.productCode
            }
          ],
          productFolder: {
            meta: {
              href: 'https://api.moysklad.ru/api/remap/1.2/entity/productfolder/dc6cbed9-67e1-11f0-0a80-0b13000012c0',
              metadataHref: 'https://api.moysklad.ru/api/remap/1.2/entity/productfolder/metadata',
              type: 'productfolder',
              mediaType: 'application/json',
              uuidHref: 'https://online.moysklad.ru/app/#good/edit?id=dc6cbed9-67e1-11f0-0a80-0b13000012c0'
            }
          },
          attributes: [
            {
              meta: {
                href: 'https://api.moysklad.ru/api/remap/1.2/entity/product/metadata/attributes/41bd5fe5-5160-11ee-0a80-0834000cfb71',
                type: 'attributemetadata',
                mediaType: 'application/json'
              },
              value: elem.boxCode
            }
          ]
        })
      }
    })
    // Удаляем те, которых уже нет в гугл таблице
    const itemsToDeleteFromMoiSklad = goods.filter(good => !data.some(el => el.id === good.code))
    itemsToDeleteFromMoiSklad.forEach(elem => {
      bodyForUpdate.push({
        meta: {
          href: `https://api.moysklad.ru/api/remap/1.2/entity/product/${elem.id}`,
          metadataHref: 'https://api.moysklad.ru/api/remap/1.2/entity/product/metadata',
          type: 'product',
          mediaType: 'application/json'
        },
        archived: true
      })
    })
  }
  catch(err){
    console.error('Ошибка при получении товаров:', err.message)
  }
  try{
    await axios.post('https://api.moysklad.ru/api/remap/1.2/entity/product', bodyForUpdate, {
      headers: {
        Authorization: 'Bearer 4f1da1b045d1daedf41a5b8a99185127cae79f95'
      }
    })
  }
  catch(err){
    console.error('Ошибка при обновлении товаров:', err.message)
  }
}

module.exports = writeToMoiSklad