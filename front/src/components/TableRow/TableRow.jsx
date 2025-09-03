import React from "react"
import DeleteBtn from "../ui/DeleteBtn/DeleteBtn"
import styles from "./styles.module.css"

function TableRow({ item, isChecked, changeCheck, deleteItems, scanHistryMode }) {
  const deleteHandler = () => {
    deleteItems(item.id)
  }
  return (
    <tr className={styles.wrapper}>
      <td className={`${styles.td1} ${styles.td}`}>
        {scanHistryMode === 'Сканирование' && <input 
          className={styles.checkbox}
          type='checkbox'
          onChange={() => changeCheck(item.id)}
          checked={isChecked}
        />}
      </td>
      <td className={`${styles.td1} ${styles.td}`}></td>
      <td className={styles.td}>{new Date(item.date).toLocaleDateString('ru-Ru')} г.</td>
      <td className={styles.td}>
      <div className={styles.shkBlock}>
              <img src='/Shk-icon.svg' alt="icon" width={21} height={17} />
              {item.boxCode}
            </div>
      </td>
      <td className={styles.td}>{item.productCode}</td>
      <td className={styles.td}>{item.quantity}</td>
      <td className={styles.td}>
        {scanHistryMode === 'Сканирование' && <div className={styles.delete}><DeleteBtn deleteItems={deleteHandler}/></div>}
      </td>
    </tr>
  );
}
export default TableRow;