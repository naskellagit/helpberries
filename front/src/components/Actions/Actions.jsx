import React from "react";
import styles from "./styles.module.css";

function Actions({pagesCount, page, setPage}) {
  const arowHandler = (type) => {
    if(type === 'up' && page < pagesCount){
      setPage(prev => ++prev)
    }
    if(type === 'down' && page > 1){
      setPage(prev => --prev)
    }
  }
  return (
    <div className={styles.actionsWrapper}>
     {pagesCount > 1 && <img 
        className={styles.arow} src='/arowBack.svg' alt="icon" width={40} height={37}
        onClick={() => arowHandler('down')}
      />}
        {
          Array.from({length: pagesCount}, (_, i) => i + 1).map(elem => (
            <button
              key={elem}
              className={`${styles.page} ${page === elem ? styles.active : null}`}
              onClick={() => setPage(elem)}
            >
              {elem}
            </button>
          ))
        }
      {pagesCount > 1 && <img
        className={styles.arow} src='/arowUp.svg' alt="icon" width={40} height={37}
        onClick={() => arowHandler('up')}
      />}
      <div className={styles.rights}>© 2025 HELPBERRIES Версия 1.0. </div>
    </div>
  );
}
export default Actions;