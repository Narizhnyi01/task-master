import styles from './Skeleton.module.css'

export const TaskListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.taskItemSkeleton}>
          <div className={styles.skeleton} />
        </div>
      ))}
    </>
  )
}

