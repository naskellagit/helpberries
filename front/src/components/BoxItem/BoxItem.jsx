import React from 'react'
import styles from './styles.module.css'

const BoxItem = ({boxNumber, boxCode = '', selectedBox}) => {
  return(
    <div className={`${styles.wrapper} ${boxNumber === selectedBox ? styles.active : null}`}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
      <img src='/box.svg' alt="icon" width={23} height={23} />
      <span>Короб {boxNumber}</span>
      <span className={styles.boxCode}>{boxCode}</span>
      </div>
      <div 
        className={styles.button}
        onClick={() => window.print()}
      >
        <img src='/boxPrint.svg' alt="icon" width={23} height={23} />
      </div>
    </div>
  )
}

export default BoxItem