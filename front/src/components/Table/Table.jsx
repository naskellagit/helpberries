import React from "react";
import TableRow from "../TableRow/TableRow";
import DeleteBtn from "../ui/DeleteBtn/DeleteBtn";
import styles from "./styles.module.css";

function Table({ 
  items,
  choosedTableData,
  isAllChecked,
  choosedTableDataIds,
  deleteItems,
  scanHistryMode,
  isLoading 
}) {
  const handleChange = (value) => {
    choosedTableData(value)
  }
  const deleteHandler = () => {
    deleteItems()
  }
  const itemCheckedHandler = (id) => {
    return choosedTableDataIds.includes(id)
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th1}>
            {scanHistryMode === 'Сканирование' && <input
              className={styles.checkbox}
              type='checkbox'
              onChange={() => handleChange('all')}
              checked={isAllChecked}
            />}
          </th>
          <th style={{width: 108}}>
          {scanHistryMode === 'Сканирование' && <DeleteBtn deleteItems={deleteHandler}/>}
          </th>
          <th>Дата сканирования</th>
          <th>
            <div className={styles.shkBlock}>
              <img src='/Shk-icon.svg' alt="icon" width={21} height={17} />
              ШК короба
            </div>
          </th>
          <th>Баркод товара</th>
          <th>Количество товара</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {!isLoading ? items.map((item) => (
          <TableRow
            key={item.id}
            item={item}
            isChecked={itemCheckedHandler(item.id)}
            changeCheck={handleChange}
            deleteItems={deleteItems}
            scanHistryMode={scanHistryMode}
          />
        )) : <tr><td><div className={styles.spinner}></div></td></tr>}
      </tbody>
    </table>
  );
}
export default Table;