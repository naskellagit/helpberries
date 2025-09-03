const axios = require('axios')
const fs = require('fs')
const bwipjs = require('bwip-js')
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib')

const createDocumentInMoiSklad = async(data, contrAgentId, boxesCodes) => {
  await generatePdfWithBarcodes(boxesCodes)
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
    applicable: false,
    attributes: [
      {
        meta: {
          href: "https://api.moysklad.ru/api/remap/1.2/entity/demand/metadata/attributes/81af6db5-4728-11ee-0a80-035a000f00db",
          type: "attributemetadata",
          mediaType: "application/json"
        },
        id: "81af6db5-4728-11ee-0a80-035a000f00db",
        name: "Количество коробов",
        type: "long",
        value: boxesCodes.length // здесь указываем нужное количество коробов
      }
    ],
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
  const res = await axios.post('https://api.moysklad.ru/api/remap/1.2/entity/demand', body, {
    headers: {
      Authorization: 'Bearer 4f1da1b045d1daedf41a5b8a99185127cae79f95',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json'
    }
  })
  const demand = res.data

  const fileContent = fs.readFileSync('barcodes.pdf')
  const base64File = fileContent.toString('base64')
  const bodyFile = [
    {
      filename: 'barcodes.pdf',
      content: base64File
    }
  ];
  await axios.post(`https://api.moysklad.ru/api/remap/1.2/entity/demand/${demand.id}/files`,
  bodyFile,
    {
      headers: {
        Authorization: 'Bearer 4f1da1b045d1daedf41a5b8a99185127cae79f95',
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/json'
      }
    }
  )

  return res
}

async function generatePdfWithBarcodes(codes) {
  const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pageWidth = 300;
    const pageHeight = 400; // фиксируем высоту страницы
    const margin = 20;
    const spacing = 10; // расстояние между штрихкодами
    const barcodeHeight = 20; // высота штрихкода
    const scale = 1.5; // масштаб

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    for (const code of codes) {
        const pngBuffer = await bwipjs.toBuffer({
            bcid: 'code128',
            text: code,
            scale: scale,
            height: barcodeHeight,
            includetext: true,
            textxalign: 'center',
        });

        const pngImage = await pdfDoc.embedPng(pngBuffer);
        const pngDims = pngImage.scale(1);

        // Если не помещается на странице — создаем новую
        if (y - pngDims.height < margin) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
        }

        page.drawImage(pngImage, {
            x: (pageWidth - pngDims.width) / 2,
            y: y - pngDims.height,
            width: pngDims.width,
            height: pngDims.height,
        });

        y -= (pngDims.height + spacing);
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('barcodes.pdf', pdfBytes);
    console.log('PDF создан: barcodes.pdf');
}

module.exports = createDocumentInMoiSklad