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
import { symbolExist } from "../utils/ExchangeInfoUtil"
import ContentContainer from './ContentContainer'
import { getConfigUnit, setConfigUnit } from '../utils/ConfigController'
import Loading from './Loading'
import { notifyError } from './notifications/NotificationsComponent'

export default function Terminal({ configIndex }) {

  const configUnit = getConfigUnit(configIndex)

  function getTerminalData() {
    const symbol = configUnit.symbol
    const apiKey = configUnit.API_KEY
    const apiSecret = configUnit.API_SECRET
    const testnet = configUnit.testnet
    return {
      symbol: symbol || '',
      apiKey: apiKey || '',
      apiSecret: apiSecret || '',
      testnet: testnet || ''
    }
  }

  const [data, setData] = useState(() => getTerminalData())
  const [loading, setLoading] = useState(true)

  setConfigUnit(configIndex, {
    label: configUnit.label,
    symbol: data.symbol,
    API_KEY: data.apiKey,
    API_SECRET: data.apiSecret,
    testnet: data.testnet
  })

  const client = (data.apiKey && data.apiSecret) ? new USDMClient({
    api_key: data.apiKey,
    api_secret: data.apiSecret,
    useTestnet: data.testnet
  }) : undefined;

  useEffect(() => {
    if (client == undefined || data.symbol == undefined || data.symbol == '') {
      setLoading(true)
    }
    else {
      symbolExist(data.symbol)
        .then(symbolExistResult => {
          if (symbolExistResult) {
            client.fetchTimeOffset()
              .then((timeOffset) => {
                client.setTimeOffset(timeOffset)
                return client.getAccountInformation()
              })
              .then(accountInformation => {
                if (accountInformation == undefined) {
                  return
                }
                setLoading(false)
              })
              .catch(err => {
                notifyError(err.message)
                console.error(err)
                setLoading(true)
              })
          }
          else {
            setLoading(true)
          }
        })
        .catch(err => setLoading(true))
    }
  }, [data])

  const getBalance = async () => {
    const timeOffset = await client.fetchTimeOffset()
    client.setTimeOffset(timeOffset)
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
      <ContentContainer>
        <div className='flex md:flex-row flex-col'>
          <div className='flex flex-col md:w-1/3 w-full'>
            <Input label="Symbol" defaultValue={data.symbol} updateValue={updateSymbol} />
            <Input label="API KEY" defaultValue={data.apiKey} updateValue={updateApiKey} />
            <Input label="API SECRET" defaultValue={data.apiSecret} updateValue={updateApiSecret} />
            <Input label="testnet" type='checkbox' defaultValue={data.testnet} />
            <ReadonlyInput label="Balance" updatableValue={client == undefined ? undefined : getBalance} />
            <div className='rounded jumbotron-bg p-2 m-2'>
              {loading && <Loading />}
              {!loading &&
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
              }
            </div>
          </div>
          <div className='flex flex-col md:w-2/3 w-full'>
            {loading && <Loading />}
            {!loading && <TerminalInfo {...{ ...{ client: client }, ...data }} />}
          </div>
        </div>
      </ContentContainer>
    </>
  )
}
