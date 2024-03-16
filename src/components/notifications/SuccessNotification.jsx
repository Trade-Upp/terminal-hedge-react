import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import NotificationProgress from './NotificationProgress'
import NotificationUnitContainer from './NotificationUnitContainer'


export default function SuccessNotification({ children, durationInSeconds, onClick }) {

  const icon = <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />

  return (
    <>
      <NotificationUnitContainer onClick={onClick}>
        <div className='rounded bg-green-700 opacity-80 text-slate-50 h-12'>
          <NotificationProgress
            icon={icon}
            durationInSeconds={durationInSeconds}
            progressColor={'bg-green-600'}>
            {children}
          </NotificationProgress>
        </div>
      </NotificationUnitContainer>
    </>
  )
}
