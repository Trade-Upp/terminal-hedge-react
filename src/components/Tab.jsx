export default function Tab({ children, isActive, onClick, title }) {

  let aClass = 'inline-block p-4 border-b-2 rounded-t-lg cursor-pointer'

  if (isActive) {
    aClass += ' text-blue-500 border-blue-500'
  }
  else {
    aClass += ' border-transparent hover:border-gray-300 hover:text-gray-300'
  }

  return (
    <li className="me-2">
      <a className={aClass} onClick={onClick}>{title}</a>
    </li>
  )
}
