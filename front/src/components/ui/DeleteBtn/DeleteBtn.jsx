import React from 'react'
import styles from './styles.module.css'

const DeleteBtn = ({deleteItems}) => {
  return(
    <button className={styles.deleteBtn} onClick={deleteItems}>
      <img src='/delete.svg' alt="icon" width={26} height={26} />
    </button>
  )
}

export default DeleteBtn