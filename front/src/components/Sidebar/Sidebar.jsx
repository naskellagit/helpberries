import React, {useState} from "react"
import generateBoxBarcode from "../../services/generateBoxBarcode"
import BoxItem from "../BoxItem/BoxItem"
import UiButton from "../ui/UiButton/UiBtton"
import UiInput from '../ui/UiInput/UiInput'
import ContragentsModal from "../ContragentsModal/ContragentsModal"
import styles from "./styles.module.css"

function Sidebar({
  boxes,
  tableData,
  deleteItems,
  selectedBox,
  setBoxNumber,
  setSelectedBox,
  scanHistryMode,
  setBoxesCount
}) {
  const [isContragentsModal, setIsContragentsModal] = useState(false)

  const setBoxNumberHandler = () => {
    setBoxesCount(prev => {
      const nextNumber = ++prev
      setBoxNumber(nextNumber)
      return nextNumber
    })
  }

  const deleteHandler = async() => {
    const deletedIds = tableData.map(el => el.id)
    await deleteItems(deletedIds)
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img src='/logo.svg' alt="icon" className={styles.logoIcon} />
        <div>
          <span className={styles.logoTitle}>HELPBERRIES</span>
          <span className={styles.logoText}>web app</span>
        </div>
      </div>
      {scanHistryMode === 'Сканирование' && (
        <div className={styles.addBlock}>
          <UiButton
            title={'+ Добавить короб'}
            scanHistryMode={''}
            callback={setBoxNumberHandler}
            isAddBox={true}
          />
        </div>
      )}
      <div className={styles.itemsWrapper}>
        <ul className={styles.list}>
          {boxes.map((box) => (
            <li
              key={box}
              className={`${styles.item} ${selectedBox === box ? styles.active : ""}`}
              onClick={() => setSelectedBox(box)}
            >
              <BoxItem
                boxNumber={box}
                deleteItems={deleteItems}
                tableData={tableData}
                boxCode={generateBoxBarcode(box)}
                selectedBox={selectedBox}
              />
            </li>
          ))}
        </ul>
      </div>
      {scanHistryMode === 'Сканирование' &&
        <div className={styles.footer}>
          <div className={styles.footerDelete}>
            <img src='/delete-footer.svg' alt="icon" width={20} height={21} onClick={deleteHandler}/>
          </div>
          <UiButton 
            title={'Записать'}
            callback={() => setIsContragentsModal(true)}
            fontWeight={500}
          />
        </div>
      }
      {isContragentsModal && <ContragentsModal setIsContragentsModal={setIsContragentsModal}/>}
    </div>
  )
}
export default Sidebar