import generateBoxBarcode from "./generateBoxBarcode"
import postItem from "./postItem"
import putItem from "./putItem"

const addedData = (tableData, boxNumber, productCode) => {
  const findedElem = tableData.find(el => el.productCode === productCode && el.boxNumber === boxNumber)
  if(findedElem){
    findedElem.quantity = Number(findedElem.quantity) + 1
    findedElem.date = new Date()
    putItem(findedElem)
  }
  else{
    const data = {
      id: Date.now(),
      boxNumber: boxNumber,
      boxCode: generateBoxBarcode(boxNumber),
      date: new Date(),
      productCode,
      quantity: 1,
      deleted: 'FALSE'
    }
    tableData.push(data)
    postItem(data)
  }
  return tableData
}

export default addedData