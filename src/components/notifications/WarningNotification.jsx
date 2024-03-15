import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import NotificationProgress from './NotificationProgress'


export default function WarningNotification({ children, durationInSeconds, onClick }) {

  const icon = <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />

  return (
    <>
      <div className='m-4 pointer-events-auto select-none' onClick={onClick}>
        <div className='rounded bg-yellow-700 opacity-80 text-slate-50 h-12'>
          <NotificationProgress
            icon={icon}
            durationInSeconds={durationInSeconds}
            progressColor={'bg-yellow-600'}>
            {children}
          </NotificationProgress>
        </div>
      </div>
    </>
  )
}
