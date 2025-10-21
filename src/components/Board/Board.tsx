import { TaskList } from '../TaskList/TaskList'
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core'
import { TaskItem } from '../TaskItem/TaskItem'
import styles from './Board.module.css'
import { useTaskDragAndDrop } from '../../hooks/useTaskDragAndDrop'
import { TaskStatusEnum } from '../../enums/app'

interface BoardProps {
    onMoveTask?: (taskId: string, newStatus: TaskStatusEnum) => void
}

export default function Board({ onMoveTask }: BoardProps) {
  const {
    activeTask,
    handleDragStart,
    handleDragEnd,
    todoTasks,
    inProgressTasks,
    doneTasks
  } = useTaskDragAndDrop(onMoveTask)

  return (
    <div className="container">
        <div className="flex jcsb">
            <DndContext 
              collisionDetection={closestCorners} 
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
                <TaskList title="To do" status={TaskStatusEnum.TODO} tasks={todoTasks} />
                <TaskList title="Doing" status={TaskStatusEnum.IN_PROGRESS} tasks={inProgressTasks} />
                <TaskList title="Done" status={TaskStatusEnum.DONE} tasks={doneTasks} />
                
                <DragOverlay className={styles.dragOverlay}>
                  {activeTask ? (<TaskItem {...activeTask} />) : null}
                </DragOverlay>
            </DndContext>
        </div>
    </div>
  )
}
