import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { toast } from 'react-toastify'
import { 
  selectDoneTasks, 
  selectInProgressTasks, 
  selectTodoTasks, 
  updateTaskStatus, 
  reorderTasks, 
  setTasks 
} from '../store/tasksSlice'
import { useUpdateTaskMutation } from '../services/api'
import { TaskStatusEnum } from '../enums/app'
import type { Task } from '../services/data'
import { getNextIndexForColumn } from '../utils/taskIndexUtils'

export const useTaskDragAndDrop = (onMoveTask?: (taskId: string, newStatus: TaskStatusEnum) => void) => {
  const dispatch = useDispatch()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [updateTask] = useUpdateTaskMutation()
  
  const todoTasks = useSelector(selectTodoTasks)
  const inProgressTasks = useSelector(selectInProgressTasks)
  const doneTasks = useSelector(selectDoneTasks)
  
  const allTasks = [...todoTasks, ...inProgressTasks, ...doneTasks]

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = allTasks.find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Находим активную задачу
    const activeTask = allTasks.find(t => t.id === activeId)
    if (!activeTask) return

    // Снепшот до изменений
    const tasksSnapshot = JSON.parse(JSON.stringify(allTasks)) as Task[]

    // Если overId - это ID колонки, перемещаем между колонками
    if (Object.values(TaskStatusEnum).includes(overId as TaskStatusEnum)) {
      handleMoveToColumn(activeId, overId as TaskStatusEnum, tasksSnapshot)
    } else if (activeId !== overId) {
      // Находим целевую задачу
      const overTask = allTasks.find(t => t.id === overId)
      
      if (overTask) {
        if (activeTask.status !== overTask.status) {
          // Перемещаем между колонками
          handleMoveToColumn(activeId, overTask.status, tasksSnapshot)
        } else {
          // Сортируем внутри колонки
          handleReorderInColumn(activeId, overId, activeTask.status, tasksSnapshot)
        }
      }
    }
    
    setActiveTask(null)
  }

  const handleMoveToColumn = (activeId: string, newStatus: TaskStatusEnum, tasksSnapshot: Task[]) => {
    // Получаем следующий доступный индекс в целевой колонке
    const newIndex = getNextIndexForColumn(allTasks, newStatus)
    
    // Оптимистично обновляем UI
    dispatch(updateTaskStatus({ id: activeId, status: newStatus, index: newIndex }))
    
    // Обновляем на сервере, при ошибке откатываем
    updateTask({ id: activeId, status: newStatus, index: newIndex })
      .unwrap()
      .catch(err => {
        console.error('Error updating task status:', err)
        toast.error('Failed to move task. Changes reverted.')
        dispatch(setTasks(tasksSnapshot))
      })
    
    onMoveTask?.(activeId, newStatus)
  }

  const handleReorderInColumn = (activeId: string, overId: string, container: TaskStatusEnum, tasksSnapshot: Task[]) => {
    // Получаем отсортированный список задач в колонке
    const containerTasks = allTasks
      .filter(task => task.status === container)
      .sort((a, b) => a.index - b.index)
    
    const activeIndex = containerTasks.findIndex(task => task.id === activeId)
    const overIndex = containerTasks.findIndex(task => task.id === overId)
    
    if (activeIndex === -1 || overIndex === -1) return
    
    // Вычисляем новый дробный индекс
    let newIndex: number
    
    if (activeIndex < overIndex) {
      // Перемещаем вниз - ставим между overTask и следующей
      const overTask = containerTasks[overIndex]
      const nextTask = containerTasks[overIndex + 1]
      newIndex = nextTask ? (overTask.index + nextTask.index) / 2 : overTask.index + 1
    } else {
      // Перемещаем вверх - ставим между предыдущей и overTask
      const overTask = containerTasks[overIndex]
      const prevTask = containerTasks[overIndex - 1]
      newIndex = prevTask ? (prevTask.index + overTask.index) / 2 : overTask.index - 1
    }
    
    // Оптимистично обновляем UI
    dispatch(reorderTasks({ 
      activeId, 
      overId, 
      container 
    }))
    
    // Отправляем только один запрос с новым дробным индексом
    updateTask({ id: activeId, index: newIndex })
      .unwrap()
      .catch(err => {
        console.error('Error updating task order:', err)
        toast.error('Failed to change task order. Changes reverted.')
        dispatch(setTasks(tasksSnapshot))
      })
  }

  return {
    activeTask,
    handleDragStart,
    handleDragEnd,
    todoTasks,
    inProgressTasks,
    doneTasks
  }
}
