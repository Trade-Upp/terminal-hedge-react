export default function NotificationUnitContainer({ onClick, children }) {
  return (
    <>
      <div className='m-4 pointer-events-auto select-none slide-in' onClick={onClick}>
        {children}
      </div>
    </>
  )
}
