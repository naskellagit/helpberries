import styles from './styles.module.css'

const UiInput = ({placeholder, isInputType, value, callback}) => {
  const getClass = () => {
    switch(isInputType){
      case 'search':
        return styles.searchInput
      case 'boxNumber':
        return styles.boxNumberInput
    }
  }
  return(
    <input
      className={`${styles.inputContainer} ${getClass()}`}
      type="text"
      value={value}
      onChange={(e) => callback(e.target.value)}
      placeholder={placeholder}
    />
  )
}

export default UiInput