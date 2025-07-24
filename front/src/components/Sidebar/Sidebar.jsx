import React, {useState} from "react"
import generateBoxBarcode from "../../services/generateBoxBarcode"
import BoxItem from "../BoxItem/BoxItem"
import UiButton from "../ui/UiButton/UiBtton"
import UiInput from '../ui/UiInput/UiInput'
import styles from "./styles.module.css"

function Sidebar({
  boxes,
  tableData,
  deleteItems,
  selectedBox,
  setBoxNumber,
  setSelectedBox,
  boxNumber,
  scanHistryMode 
}) {
  const [boxNumberLocal, setBoxNumberLocal] = useState(boxNumber)

  const setBoxNumberHandler = () => {
    setBoxNumber(boxNumberLocal)
    setBoxNumberLocal('')
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
        <UiInput
          isInputType={'boxNumber'}
          value={boxNumberLocal}
          callback={setBoxNumberLocal}
        />
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
                scanHistryMode={scanHistryMode}
              />
            </li>
          ))}
        </ul>
      </div>
      {scanHistryMode === 'Сканирование' && 
      <UiButton 
        title={'Печать'}
        callback={() => window.print()}
        isPrint
      />}
    </div>
  )
}
export default Sidebar