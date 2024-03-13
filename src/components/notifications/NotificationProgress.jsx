export default function NotificationProgress({ icon, children, progress, progressColor }) {

  const maxProgress = 258
  const maxProgressStyle = {
    width: maxProgress + 'px',
    marginTop: '-0.125rem',
  }
  const currentProgressStyle = {
    ...maxProgressStyle,
    width: progress * maxProgress
  }

  return (
    <>
      <div className='size-full font-bold'>
        <div className='size-full flex items-center justify-center'>
          {icon}
          {children}
        </div>
        <div
          className={`h-0.5 bottom-0 ${progressColor} mr-1 ml-1`}
          style={currentProgressStyle}></div>
      </div >
    </>
  )
}
