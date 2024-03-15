import { useEffect, useState } from "react"
import WarningNotification from "./WarningNotification"
import ErrorNotification from "./ErrorNotification"
import SuccessNotification from "./SuccessNotification"

let setNotificationListFunction
let notificationListArray

export const WARNING_NOTIFICATION = 'warning'
export const ERROR_NOTIFICATION = 'error'
export const SUCCESS_NOTIFICATION = 'success'

export default function NotificationsComponent() {

  const [notificationList, setNotificationList] = useState([])
  setNotificationListFunction = setNotificationList
  notificationListArray = notificationList

  function updateNotificationList() {
    const newNotificationList = getNewNotificationList()
    setNotificationList(newNotificationList)
  }

  function getNewNotificationList() {
    let newNotificationList = notificationList.filter((notification) => {
      return notification.endTime > new Date().getTime()
    })
    return newNotificationList.map((notification) => {
      notification.progress = getNewProgress(notification)
      return notification
    })
  }

  function getNewProgress(notification) {
    const now = new Date().getTime()
    const allProgress = notification.endTime - notification.startTime
    const currentTimeDiff = now - notification.startTime
    return currentTimeDiff / allProgress
  }

  useEffect(() => {
    const interval = setInterval(updateNotificationList, 10)
    return () => {
      clearInterval(interval)
    }
  })

  function onNotificationClick(index) {
    const newNotificationList = removeNotification(index)
    setNotificationList(newNotificationList)
  }

  function removeNotification(index) {
    const newNotificationList = [
      ...notificationList
    ]
    newNotificationList.splice(index, 1)
    return newNotificationList
  }

  function createNotificationComponent(notification, index) {
    let result
    switch (notification.type) {
      case WARNING_NOTIFICATION:
        result = (
          <WarningNotification
            key={index}
            progress={notification.progress}
            onClick={() => onNotificationClick(index)}>
            {notification.message}
          </WarningNotification>
        )
        break;
      case ERROR_NOTIFICATION:
        result = (
          <ErrorNotification
            key={index}
            progress={notification.progress}
            onClick={() => onNotificationClick(index)}>
            {notification.message}
          </ErrorNotification>
        )
        break;
      case SUCCESS_NOTIFICATION:
        result = (
          <SuccessNotification
            key={index}
            progress={notification.progress}
            onClick={() => onNotificationClick(index)}>
            {notification.message}
          </SuccessNotification>
        )
        break;
    }
    return result
  }

  return (
    <>
      <div className="notifications-container">
        {notificationList.map((notification, index) => {
          return (
            createNotificationComponent(notification, index)
          )
        })}
      </div>
    </>
  )
}

export function notifyWarning(message, durationInSeconds = 5) {
  addNotification(message, durationInSeconds, WARNING_NOTIFICATION)
}

export function notifyError(message, durationInSeconds = 5) {
  addNotification(message, durationInSeconds, ERROR_NOTIFICATION)
}

export function notifySuccess(message, durationInSeconds = 5) {
  addNotification(message, durationInSeconds, SUCCESS_NOTIFICATION)
}

function addNotification(message, durationInSeconds, type) {
  setNotificationListFunction((prevNotificationList) => [
    ...prevNotificationList,
    {
      message: message,
      type: type,
      startTime: new Date().getTime(),
      endTime: new Date().getTime() + durationInSeconds * 1000,
      progress: 0
    }
  ])
}
