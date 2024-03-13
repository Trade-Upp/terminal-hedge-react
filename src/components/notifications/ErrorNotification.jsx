import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import NotificationProgress from './NotificationProgress'


export default function ErrorNotification({ children, progress, onClick }) {

  const icon = <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />

  return (
    <>
      <div className='m-4 pointer-events-auto select-none' onClick={onClick}>
        <div className='rounded bg-red-700 opacity-80 text-slate-50 h-12'>
          <NotificationProgress
            icon={icon}
            progress={progress}
            progressColor={'bg-red-600'}>
            {children}
          </NotificationProgress>
        </div>
      </div>
    </>
  )
}
