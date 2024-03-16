import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import NotificationProgress from './NotificationProgress'


export default function ErrorNotification({ children, durationInSeconds, onClick }) {

  const icon = <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />

  return (
    <>
      <div className='m-4 pointer-events-auto select-none' onClick={onClick}>
        <div className='transition duration-300 rounded bg-red-700 opacity-80 hover:opacity-100 text-slate-50'>
          <NotificationProgress
            icon={icon}
            durationInSeconds={durationInSeconds}
            progressColor={'bg-red-600'}>
            {children}
          </NotificationProgress>
        </div>
      </div>
    </>
  )
}
