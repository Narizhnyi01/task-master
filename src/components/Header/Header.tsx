import styles from './Header.module.css'
import logoImg from '../../assets/logo.png'
import taskIcon from '../../assets/icons/task.svg'
import { Button } from '../Button/Button'



export const Header = () => {
  return (
    <header className={styles.header}>
        <div className="container">
            <div className="flex aic jcsb">
                <div className="flex aic fg-1">
                  <img src={logoImg} alt="Logo" className={styles.logo} />
                  <input type="text" placeholder="Add new task" className={styles.input} />
                  <Button text="+" onClick={() => { console.log('Add') }} />
                </div>
                <div className="flex aic">
                  <h1 className={styles.title}>Task Master</h1>
                  <img src={taskIcon} width="38px" height="38px" alt="Task" className={styles.taskIcon} />
                </div>
            </div>
        </div>
    </header>
  )
}
