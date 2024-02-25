import { useEffect, useState } from 'react'
import Input from './Input'
import ReadonlyInput from './ReadonlyInput'
import { USDMClient } from 'binance'
import TerminalInfo from './TerminalInfo'

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
  const client = new USDMClient({
    api_key: data.apiKey,
    api_secret: data.apiSecret,
    useTestnet: data.testnet
  });

  useEffect(() => {

    const updateTimeOffset = () => {
      client.fetchTimeOffset().then((result) => {
        client.setTimeOffset(result)
        console.log('updated time offset', client.getTimeOffset())
      })
    }

    updateTimeOffset()
    const intervalUpdatingTimeOffset = setInterval(() => {
      updateTimeOffset()
    }, 100 * 1000)

    return () => {
      clearInterval(intervalUpdatingTimeOffset)
    }
  }, [])

  const getBalance = async () => {
    const balance = await client.getBalance()
    const usdtBalance = balance.find((element) => element.asset == 'USDT')
    const usdtBalanceBalance = Math.round(usdtBalance.balance * 100) / 100
    return usdtBalanceBalance
  }

  return (
    <>
      <div className='container mx-auto container-bg rounded mt-4'>
        <div className='flex flex-row'>
          <div className='flex flex-col w-1/3'>
            <Input label="Symbol" localStorageKey='symbol' defaultValue={data.symbol} />
            <Input label="API KEY" localStorageKey='apiKey' defaultValue={data.apiKey} />
            <Input label="API SECRET" localStorageKey='apiSecret' defaultValue={data.apiSecret} />
            <Input label="testnet" type='checkbox' localStorageKey='testnet' defaultValue={data.testnet} />
            <ReadonlyInput label="Balance" updatableValue={getBalance} />
          </div>
          <div className='flex flex-col w-2/3'>
            <TerminalInfo {...{ ...{ client: client }, ...data }} />
          </div>
        </div>
      </div>
    </>
  )
}
