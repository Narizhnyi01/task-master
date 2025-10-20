import styles from './Button.module.css'


export const Button = ({ text, onClick }: { text: string, onClick: () => void }) => {
  return (
    <button className={styles.button} onClick={onClick}>
        {text}
    </button>
  )
}
