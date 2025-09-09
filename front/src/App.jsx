import React, { useState, useEffect, useRef } from "react"
import Sidebar from "./components/Sidebar/Sidebar"
import SearchComponent from './components/SearchComponent/SearchComponent'
import Table from "./components/Table/Table"
import Actions from "./components/Actions/Actions"
import Barcode from "react-barcode"
import addedData from "./services/addedData"
import styles from "./App.module.css"
import generateBoxBarcode from "./services/generateBoxBarcode"
import getDataFromNet from "./services/getDataFromNet"
import InfoWindow from "./components/InfoWindow/InfoWindow"
import putItem from "./services/putItem"
import deleteItem from './services/deleteItem'

function App() {
  const [boxNumber, setBoxNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBox, setSelectedBox] = useState(null)
  const [scanHistryMode, setScanHistoryMode] = useState('Сканирование')
  const [tableData, setTableData] = useState([])
  const [choosedTableDataIds, setChoosedTableDataIds] = useState([])
  const [scanCode, setScanCode] = useState('')
  const [isFocusScan, setIsFocusScan] = useState(true)
  const [boxes, setBoxes] = useState([])
  const [isLoadingForDelete, setIsLoadingForDelete] = useState(false)
  const [isLoadingForGetData, setIsLoadingForGetData] = useState(false)
  const [page, setPage] = useState(1)
  const [boxesCount, setBoxesCount] = useState(0)

  const limit = 12

  const scanInput = useRef(null)

  async function getData(){
    setIsLoadingForGetData(true)
    const res = await getDataFromNet(scanHistryMode)
    const data = res.data || []
    setBoxesCount(res.boxesCount)
    setTableData(data)
    if(!data.length){
      setBoxes([])
      setBoxNumberAndSelectedBox(null)
      setIsLoadingForGetData(false)
      return
    }
    setSelectedBox(data[0].boxNumber)
    setBoxes(Array.from(new Set(data.map(item => item.boxNumber))).sort((a, b) => b - a))
    setIsLoadingForGetData(false)
  }

  useEffect(() => {
    getData(scanHistryMode)
    const handleClick = (event) => {
      if(event.target.tagName !== 'INPUT' &&  event.target.id !== 'История') scanInput.current.focus()
    }
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick);
    }
  }, [])

  useEffect(() => {
    setChoosedTableDataIds([])
    setPage(1)
  }, [selectedBox])

  useEffect(() => {
    setTableData([])
    setBoxes([])
    getData(scanHistryMode)
    if(scanHistryMode === 'Сканирование'){
      scanInput.current.focus()
    }
    else{
      scanInput.current.blur()
    }
  }, [scanHistryMode])

  useEffect(() => {
    setChoosedTableDataIds([])
  }, [page])

  useEffect(() => {
    if(boxNumber && !boxes.includes(boxNumber)){
      const newBoxes = sortBoxes(boxes, boxNumber)
      setBoxes(newBoxes)
    } 
  }, [boxNumber])

  const sortBoxes = (boxes, newBox) => {
    const result = [...boxes].sort((a, b) => b - a)
    result.unshift(newBox)
    return result
  }

  const filteredItemsForSearch = searchQuery ? tableData.filter(item => item.productCode.toLowerCase() == searchQuery.toLowerCase()) : tableData

  const setBoxNumberAndSelectedBox = (value) => {
    setBoxNumber(value)
    setSelectedBox(value)
    scanInput.current.focus()
    setIsFocusScan(true)
  }

  const boxItems = filteredItemsForSearch.filter(el => el.boxNumber == selectedBox).reverse()
  const filteredItems = boxItems.slice((page - 1) * limit, page * limit)

  const scanHandler = (e) => {
    if(boxes.length) setScanCode(e.target.value)
  }

  const handleKeyDown = async(e) => {
    if (e.key === "Enter" && boxes.length && scanCode) {
      setPage(1)
      setTableData(await addedData([...tableData], selectedBox, scanCode))
      setScanCode('')
    }
  }

  const scanButtonHandler = (value) => {
    setScanHistoryMode(value)
    scanInput.current.focus()
    value === 'Сканирование' && setIsFocusScan(true)
  }

  const blurScanInputHandler = () => {
    // setIsFocusScan(false)
    // setScanHistoryMode('История')
  }

  const choosedTableData = (value) => {
    if(value === 'all'){
      if(choosedTableDataIds.length){
        setChoosedTableDataIds([])
        return
      } 
      const chosedIds = filteredItems.filter(el => el.boxNumber === selectedBox).map(el => el.id)
      setChoosedTableDataIds(chosedIds)
    }
    else{
      let newData = [...choosedTableDataIds]
      const findedEl = newData.find(el => el === value)
      if(findedEl) newData = newData.filter(el => el !== findedEl)
      else newData.push(value)
      setChoosedTableDataIds(newData)
    }
  }

  const deleteTableRow = async(id) => {
    setIsLoadingForDelete(true)
    if(Array.isArray(id)){
      let newTableData = [...tableData]
      newTableData = newTableData.filter(dataItem => !id.some(el => el === dataItem.id))
      setTableData(newTableData)
      setChoosedTableDataIds([])
      const promises = []
      for(const _id of id){
        const findedElem = tableData.find(el => el.id === _id)
        if(findedElem){
          if(scanHistryMode === 'Сканирование'){
            findedElem.deleted = 'TRUE'
            promises.push(putItem(findedElem))
          }
          else{
            await deleteItem(_id)
          }
        }
      }
      scanHistryMode === 'Сканирование' && await Promise.all(promises)
      setPage(1)
      await getData(scanHistryMode)
      setIsLoadingForDelete(false)
      return
    }
    if(id){
      let newTableData = [...tableData]
      const findedElem = newTableData.find(el => el.id === id)
      if(findedElem) {
        findedElem.deleted = 'TRUE'
        await putItem(findedElem)
      }
      newTableData = newTableData.filter(dataItem => dataItem.id !== id)
      setTableData(newTableData)
      setIsLoadingForDelete(false)
      return
    }
    if(choosedTableDataIds.length){
      let newTableData = [...tableData]
      newTableData = newTableData.filter(dataItem => !choosedTableDataIds.some(el => el === dataItem.id))
      setTableData(newTableData)
      setChoosedTableDataIds([])
      const promises = []
      for(const id of choosedTableDataIds){
        const findedElem = tableData.find(el => el.id === id)
        if(findedElem){
          findedElem.deleted = 'TRUE'
          promises.push(putItem(findedElem))
        }
      }
      await Promise.all(promises)
      setPage(1)
      getData(scanHistryMode)
    }
    setIsLoadingForDelete(false)
  }

  return (
    <div className={styles.appWrapper}>
      {isLoadingForDelete && <InfoWindow title={'Удаление...'}/>}
      <Sidebar
        boxes={boxes}
        tableData={tableData}
        deleteItems={deleteTableRow}
        selectedBox={selectedBox}
        setSelectedBox={setSelectedBox}
        setBoxNumber={setBoxNumberAndSelectedBox}
        boxNumber={boxNumber}
        scanHistryMode={scanHistryMode}
        setBoxesCount={setBoxesCount}
      />
      <div className={styles.contentArea}>
        <SearchComponent
          isScan={isFocusScan}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          scanHistryMode={scanHistryMode}
          setScanHistoryMode={scanButtonHandler}
        />
        <div className={styles.content}>
          <Table
            items={filteredItems} 
            choosedTableData={choosedTableData}
            isAllChecked={choosedTableDataIds.length && choosedTableDataIds.length === tableData.filter(el => el.boxNumber === selectedBox).slice((page - 1) * limit, page * limit).length}
            choosedTableDataIds={choosedTableDataIds}
            deleteItems={deleteTableRow}
            scanHistryMode={scanHistryMode}
            isLoading={isLoadingForGetData}
          />
        </div>
        <div className={styles.footer}>
          <Actions 
            pagesCount={Math.ceil(boxItems.length / limit)}
            page={page}
            setPage={setPage}
          />
        </div>
        <input
          type='text'
          value={scanCode}
          onChange={scanHandler}
          onKeyDown={handleKeyDown}
          autoFocus
          ref={scanInput}
          onBlur={blurScanInputHandler}
          style={{opacity: 0, position: 'absolute'}}
        />
      </div>
    </div>
  )
}
export default App