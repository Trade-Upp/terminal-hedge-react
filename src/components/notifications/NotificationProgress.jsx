export default function NotificationProgress({ icon, children, durationInSeconds, progressColor }) {

  const currentProgressStyle = {
    marginTop: '-0.125rem',
    animation: `expand-width-to-258 ${durationInSeconds}s forwards linear`
  }

  return (
    <>
      <div className='size-full font-bold'>
        <div className='size-full flex items-center justify-center p-2'>
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
