import React from 'react'
import styles from './styles.module.css'

const BoxItem = ({
  boxNumber,
  tableData,
  deleteItems,
  boxCode = '',
  selectedBox,
  scanHistryMode,
  setIsMultiPrint
}) => {
  const deleteBoxHandler = async() => {
    const deletedIds = tableData.filter(el => el.boxNumber == boxNumber).map(el => el.id)
    await deleteItems(deletedIds)
  }
  const printHandler = () => {
    setIsMultiPrint(false)
  }
  return(
    <div className={`${styles.wrapper} ${boxNumber === selectedBox ? styles.active : null}`}>
      <div className={styles.leftPart}>
        <img src='/box.svg' alt="icon" width={23} height={23}/>
        <span>Короб</span>
        <span className={styles.boxCode}>{boxCode}</span>
      </div>
      <div className={styles.rightPart}>
        {/* {scanHistryMode === 'Сканирование' &&
          <div 
            className={styles.button}
            onClick={printHandler}
          >
            <img src='/boxPrint.svg' alt="icon" width={23} height={23} />
          </div>
        } */}
        <img src='/closeButton.svg' alt="icon" width={14} height={14} onClick={deleteBoxHandler}/>
      </div>
    </div>
  )
}

export default BoxItem