import UiButton from '../ui/UiButton/UiBtton'
import UiInput from '../ui/UiInput/UiInput'
import styles from './styles.module.css'

const SearchComponent = ({
  searchQuery,
  setSearchQuery,
  scanHistryMode,
  setScanHistoryMode,
  isScan
}) => {
  const scanBtnCallback = () => {
    setScanHistoryMode('Сканирование')
  }
  const historyBtnCallback = () => {
    setScanHistoryMode('История')
  }
  return(
    <div className={styles.container}>
      <UiInput
        placeholder={'Поиск товаров по коду'}
        isInputType={'search'}
        value={searchQuery}
        callback={setSearchQuery}
      />
      <div style={{display: 'inline-flex', alignItems: 'center'}}>
        {/* <span className={styles.scanIndicator} style={{backgroundColor: isScan ? 'green' : 'red'}}></span> */}
        <UiButton
          title={'Сканирование'}
          scanHistryMode={scanHistryMode}
          callback={scanBtnCallback}
          isActive={scanHistryMode === 'Сканирование'}
        />
        <UiButton
          title={'История'}
          scanHistryMode={scanHistryMode}
          callback={historyBtnCallback}
          isActive={scanHistryMode === 'История'}
        />
      </div>
      <div
        className={styles.dateBlock}
      >
        {new Date().toLocaleDateString('ru-Ru')} г.
      </div>
    </div>
  )
}

export default SearchComponent

