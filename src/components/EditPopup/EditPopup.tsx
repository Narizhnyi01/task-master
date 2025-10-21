import { useState } from 'react'
import { Button } from '../Button/Button'
import styles from './EditPopup.module.css'

interface EditPopupProps {
  text: string
  onClose: () => void
  onSave: (text: string) => void
  isUpdating: boolean
}

export const EditPopup = ({ text, onClose, onSave, isUpdating }: EditPopupProps) => {
  const [editedText, setEditedText] = useState(text)

  return (
    <div className={styles.editPopup} onClick={onClose}>
        <div className={styles.editPopupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.editPopupContentHeader}>
                <h1>Edit Task</h1>
            </div>
            <input className={styles.editPopupContentInput} type="text" placeholder="Task name" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
            <div className={styles.editPopupContentFooter}>
                <Button text="Cancel" onClick={onClose} disabled={isUpdating} />
                <Button text={isUpdating ? 'Updating...' : 'Save'} onClick={() => onSave(editedText)} disabled={isUpdating || editedText.trim() === ''} />
            </div>
        </div>
    </div>
  )
}
