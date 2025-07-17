import styles from './styles.module.css'

const UiButton = ({
  title,
  isPrint,
  callback,
  isActive,
  isAddBox
}) => {
  return(
    <button
      className={`${styles.button} ${isAddBox && styles.addBox} ${title === 'Сканирование' ? styles.scan : null} ${title === 'История' ? styles.history : null} ${(title === 'Сканирование' || title === 'История') && isActive ? styles.active : null}`}
      onClick={callback}
      id={title}
    >
      {isPrint && <img src='/boxPrint.svg' alt="icon" width={23} height={23} />}
      {title}
    </button>
  )
}

export default UiButton