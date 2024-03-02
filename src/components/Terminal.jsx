import { useEffect, useState } from 'react'
import Input from './Input'
import ReadonlyInput from './ReadonlyInput'
import { USDMClient } from 'binance'
import TerminalInfo from './TerminalInfo'
import Tabs from './Tabs'
import Tab from './Tab'
import LimitOrderCreator from './order_creators/LimitOrderCreator'
import MarketOrderCreator from './order_creators/MarketOrderCreator'
import StopMarketOrderCreator from './order_creators/StopMarketOrderCreator'
import StopLimitOrderCreator from './order_creators/StopLimitOrderCreator'

export default function Terminal() {

  function getTerminalData() {
    const symbol = localStorage.getItem('symbol')
    const apiKey = localStorage.getItem('apiKey')
    const apiSecret = localStorage.getItem('apiSecret')
    const testnet = localStorage.getItem('testnet')
    return {
      symbol: symbol || '',
      apiKey: apiKey || '',
      apiSecret: apiSecret || '',
      testnet: testnet || ''
    }
  }

  const [data, setData] = useState(getTerminalData())
  const client = (data.apiKey && data.apiSecret) ? new USDMClient({
    api_key: data.apiKey,
    api_secret: data.apiSecret,
    useTestnet: data.testnet
  }) : undefined;

  useEffect(() => {

    const updateTimeOffset = () => {
      client.fetchTimeOffset().then((result) => {
        client.setTimeOffset(result)
        console.log('updated time offset', client.getTimeOffset())
      })
    }

    let intervalUpdatingTimeOffset
    if (client != undefined) {
      updateTimeOffset()
      intervalUpdatingTimeOffset = setInterval(() => {
        updateTimeOffset()
      }, 100 * 1000)
    }

    return () => {
      if (intervalUpdatingTimeOffset != undefined) {
        clearInterval(intervalUpdatingTimeOffset)
      }
    }
  }, [])

  const getBalance = async () => {
    const balance = await client.getBalance()
    const usdtBalance = balance.find((element) => element.asset == 'USDT')
    const usdtBalanceBalance = Math.round(usdtBalance.balance * 100) / 100
    return usdtBalanceBalance
  }

  function updateSymbol(event) {
    const value = event.target.value
    const dataCopy = { ...data }
    dataCopy.symbol = value
    setData(dataCopy)
  }

  function updateApiKey(event) {
    const value = event.target.value
    const dataCopy = { ...data }
    dataCopy.apiKey = value
    setData(dataCopy)
  }

  function updateApiSecret(event) {
    const value = event.target.value
    const dataCopy = { ...data }
    dataCopy.apiSecret = value
    setData(dataCopy)
  }

  return (
    <>
      <div className='container mx-auto container-bg rounded mt-4'>
        <div className='flex md:flex-row flex-col'>
          <div className='flex flex-col md:w-1/3 w-full'>
            <Input label="Symbol" localStorageKey='symbol' defaultValue={data.symbol} updateValue={updateSymbol} />
            <Input label="API KEY" localStorageKey='apiKey' defaultValue={data.apiKey} updateValue={updateApiKey} />
            <Input label="API SECRET" localStorageKey='apiSecret' defaultValue={data.apiSecret} updateValue={updateApiSecret} />
            <Input label="testnet" type='checkbox' localStorageKey='testnet' defaultValue={data.testnet} />
            <ReadonlyInput label="Balance" updatableValue={client == undefined ? undefined : getBalance} />
            <div className='rounded jumbotron-bg p-2 m-2'>
              <Tabs>
                <Tab title="Limit">
                  <LimitOrderCreator client={client} symbol={data.symbol} />
                </Tab>
                <Tab title="Market">
                  <MarketOrderCreator client={client} symbol={data.symbol} />
                </Tab>
                <Tab title="Stop Market">
                  <StopMarketOrderCreator client={client} symbol={data.symbol} />
                </Tab>
                <Tab title="Stop Limit">
                  <StopLimitOrderCreator client={client} symbol={data.symbol} />
                </Tab>
              </Tabs>
            </div>
          </div>
          <div className='flex flex-col md:w-2/3 w-full'>
            <TerminalInfo {...{ ...{ client: client }, ...data }} />
          </div>
        </div>
      </div>
    </>
  )
}
