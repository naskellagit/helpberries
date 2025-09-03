import React from "react"
import styles from './styles.module.css'

const InfoWindow = ({title}) => {
  return(
    <div className={styles.wrapper}>
      <div className={styles.contentPart}>
        {title}
        <div className={styles.spinner}></div>
      </div>
    </div>
  )
}

export default InfoWindow