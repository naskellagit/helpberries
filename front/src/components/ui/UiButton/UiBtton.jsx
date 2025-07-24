import styles from './styles.module.css'

const UiButton = ({
  title,
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
      {title}
    </button>
  )
}

export default UiButton