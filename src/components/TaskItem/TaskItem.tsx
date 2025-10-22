import styles from './TaskItem.module.css'
import buttonStyles from '../Button/Button.module.css'
import type { Task } from '../../services/data'
import { useDeleteTaskMutation, useUpdateTaskMutation } from '../../services/api'
import { Button } from '../Button/Button'
import { EditPopup } from '../EditPopup/EditPopup'
import { ConfirmPopup } from '../ConfirmPopup/ConfirmPopup'
import { useState } from 'react'
import { toast } from 'react-toastify'
import type { DraggableSyntheticListeners } from '@dnd-kit/core'

interface TaskItemProps extends Task {
  dragListeners?: DraggableSyntheticListeners
}

export const TaskItem = ({ dragListeners, ...task }: TaskItemProps) => {
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation()
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleDeleteClick = () => setIsConfirming(true)
  
  const handleConfirmDelete = async () => {
    try {
      await deleteTask(task.id).unwrap()
      setIsConfirming(false)
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const handleCancelDelete = () => setIsConfirming(false)

  const handleToggleEdit = () => setIsEditing(!isEditing)
  const handleUpdate = async (text: string) => {
    try {
      await updateTask({ id: task.id, text }).unwrap()
    } catch {
      toast.error('Failed to update task')
    } finally {
      handleToggleEdit()
    }
  }
  return (
    <>
      <div className={styles.taskItem}>
        <div className={styles.taskItemContent} {...dragListeners}>
          <h3 className={styles.taskItemTitleText}>{task.text}</h3>
        </div>
         <div className={styles.buttonsRow}>
           <Button text="✎" className={buttonStyles.btnIcon} onClick={handleToggleEdit} />
           <Button text="✖" className={buttonStyles.btnIcon} onClick={handleDeleteClick} />
         </div>
      </div>
      {isEditing && <EditPopup text={task.text} onClose={handleToggleEdit} onSave={handleUpdate} isUpdating={isUpdating} />}
      {isConfirming && (
        <ConfirmPopup 
          title="Are you sure you want to delete this task?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  )
}
