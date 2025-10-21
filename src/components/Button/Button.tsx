import styles from './Button.module.css'


export const Button = ({ text, onClick, className, disabled }: { text: string, onClick: () => void, className?: string, disabled?: boolean }) => {
  return (
    <button className={`${styles.button} ${className ? className : ''}`} onClick={onClick} disabled={disabled}>
        {text}
    </button>
  )
}
