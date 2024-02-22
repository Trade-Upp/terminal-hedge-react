import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-row'>
          <div className='flex flex-col w-1/3'>test</div>
          <div className='flex flex-col w-2/3'>test</div>
        </div>
      </div>
    </>
  )
}

export default App
