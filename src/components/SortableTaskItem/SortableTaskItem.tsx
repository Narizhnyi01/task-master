import { useSortable } from '@dnd-kit/sortable'
import { TaskItem } from '../TaskItem/TaskItem'
import type { Task } from '../../services/data'
import { TaskStatusEnum } from '../../enums/app'

interface SortableTaskItemProps {
  task: Task
  container: TaskStatusEnum
}

export const SortableTaskItem = ({ task, container }: SortableTaskItemProps) => {
  const { attributes, listeners, setNodeRef } = useSortable({
    id: task.id,
    data: { container },
  })


  return (
    <div ref={setNodeRef} {...attributes}>
      <TaskItem {...task} dragListeners={listeners} />
    </div>
  )
}
