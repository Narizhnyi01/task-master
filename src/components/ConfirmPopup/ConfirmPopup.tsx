import { Button } from '../Button/Button'
import styles from './ConfirmPopup.module.css'

interface ConfirmPopupProps {
  title: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

export const ConfirmPopup = ({ title, onConfirm, onCancel, isDeleting }: ConfirmPopupProps) => {
  return (
    <div className={styles.confirmPopup} onClick={onCancel}>
        <div className={styles.confirmPopupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmPopupContentHeader}>
                <h1>{title}</h1>
            </div>
            <div className={styles.confirmPopupContentFooter}>
                <Button text={isDeleting ? 'Deleting...' : 'Delete'} onClick={onConfirm} disabled={isDeleting} />
                <Button text="Cancel" onClick={onCancel} disabled={isDeleting} />
            </div>
        </div>
    </div>
  )
}
