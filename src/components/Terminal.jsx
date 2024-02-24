import { useState } from 'react'
import Input from './Input'
import ReadonlyInput from './ReadonlyInput'

export default function Terminal() {

  function getTerminalData() {
    return {
      symbol: localStorage.getItem('symbol'),
      apiKey: localStorage.getItem('apiKey'),
      apiSecret: localStorage.getItem('apiSecret'),
      testnet: localStorage.getItem('testnet')
    }
  }

  const [data, setData] = useState(getTerminalData())

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-row'>
          <div className='flex flex-col w-1/3'>
            <Input label="Symbol" localStorageKey='symbol' defaultValue={data.symbol} />
            <Input label="API KEY" localStorageKey='apiKey' defaultValue={data.apiKey} />
            <Input label="API SECRET" localStorageKey='apiSecret' defaultValue={data.apiSecret} />
            <Input label="testnet" type='checkbox' localStorageKey='testnet' defaultValue={data.testnet} />
            <ReadonlyInput label="Balance">test</ReadonlyInput>
          </div>
          <div className='flex flex-col w-2/3'>
            <div className='w-full h-full flex items-center justify-center'>
              here will be more info
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
