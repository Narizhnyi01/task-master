import type { Task } from '../../services/data'
import { TaskItem } from '../TaskItem/TaskItem'
import { TaskStatusEnum } from '../../enums/app'
import styles from './TaskList.module.css'
import { statusIcons } from '../../utils/statusIcons'

interface TaskListProps {
  title: string
  status: TaskStatusEnum
  tasks: Task[]
}

export const TaskList = ({ title, status, tasks }: TaskListProps) => {
  return (
    <div className={styles.list}>
        <div className="flex aic jcc">
          <h2 className={styles.title}>{title}</h2>
          <img src={statusIcons[status]} alt={status} />
        </div>
        <div className={styles.tasks}>
          {tasks.map(task => <TaskItem key={task.id} {...task} />)}
        </div>
    </div>
  )
}
