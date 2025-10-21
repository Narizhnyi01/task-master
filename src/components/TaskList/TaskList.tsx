import type { Task } from '../../services/data'
import { TaskStatusEnum } from '../../enums/app'
import styles from './TaskList.module.css'
import { statusIcons } from '../../utils/statusIcons'
import { SortableTaskItem } from '../SortableTaskItem/SortableTaskItem'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface TaskListProps {
  title: string
  status: TaskStatusEnum
  tasks: Task[]
  children?: React.ReactNode
}

export const TaskList = ({ title, status, tasks, children }: TaskListProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
    data: { container: status }
  })

  return (
    <div 
      ref={setNodeRef} 
      className={`${styles.list} ${isOver ? styles.dragOver : ''}`}
    >
        <div className="flex aic jcc">
          <h2 className={styles.title}>{title}</h2>
          <img src={statusIcons[status]} alt={status} />
        </div>
        <div className={styles.tasks}>
          {children || (
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              {tasks.map(task => <SortableTaskItem key={task.id} task={task} container={status} />)}
            </SortableContext>
          )}
        </div>
    </div>
  )
}
