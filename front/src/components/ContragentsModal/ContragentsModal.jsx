import {useState, useEffect } from 'react'
import styles from './styles.module.css'
import chooseContragent from '../../services/chooseContragent'
import putDataInMoiSklad from '../../services/putDataInMoiSklad'

const ContragentsModal = ({setIsContragentsModal}) => {

  const [contragents, setContragents] = useState([])
  const [documentLink, setDocumentLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    (async() => {setContragents(await chooseContragent())})()
  }, [])

  const sendContragent = async(data) => {
    setIsLoading(true)
    const respose = await putDataInMoiSklad(data)
    if(respose) setDocumentLink(respose)
    setIsLoading(false)
  }

  return(
    <div className={styles.wrapper}>
      <div className={styles.contentPart}>
        {isLoading && <div className={styles.spinner}></div>}
        {!documentLink && !isLoading && (
          <>
            <h1>Выберите контрагента</h1>
            <div className={styles.container}>
              {contragents.length === 0 ? (
                <div className={styles.spinner}></div>
              ) : (
                <ul className={styles.contragents}>
                  {contragents.length > 0 && contragents.map(el => (
                    <li onClick={() => sendContragent({id: el.id})} key={el.id}>{el.name}</li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={() => setIsContragentsModal(false)}>Отмена</button>
          </>)} 
          {documentLink && !isLoading && (
            <>
              {typeof(documentLink) !== 'object' && <a target='blank' href={documentLink}>Перейти к просмотру документа</a>}
              {documentLink.error && <div>
                <h6>Ошибка</h6>
                <p>{documentLink.error}</p>
                </div>}
              <button onClick={() => setIsContragentsModal(false)}>ОК</button>
            </>
          )}
      </div>
    </div>
  )
}

export default ContragentsModal