import styles from './TaskItem.module.css'
import type { Task } from '../../services/data'

export const TaskItem = (task: Task) => {
  return (
    <div className={styles.taskItem}>
      <div className={styles.taskItemContent}>
        <div className={styles.taskItemTitle}>
          <h3 className={styles.taskItemTitleText}>{task.text}</h3>
        </div>
      </div>
    </div>
  )
}
