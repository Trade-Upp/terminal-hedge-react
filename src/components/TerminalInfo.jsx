import { USDMClient, WebsocketClient } from "binance"
import { useEffect, useState } from "react"
import PositionTable from "./terminal_info/PositionTable"
import OrderTable from "./terminal_info/OrderTable"
import Tabs from "./Tabs"
import Tab from "./Tab"
import Loading from "./Loading"

export default function TerminalInfo({ symbol, apiKey, apiSecret, testnet, client }) {

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const wsClient = new WebsocketClient(
      {
        api_key: apiKey,
        api_secret: apiSecret,
        beautify: true,
      },
    )

    wsClient.on('message', (data) => { })

    wsClient.on('open', (data) => {
      // console.log('connection opened open:', data.wsKey, data.ws.target.url);
    })

    wsClient.on('formattedMessage', (data) => {
    })

    // read response to command sent via WS stream (e.g LIST_SUBSCRIPTIONS)
    wsClient.on('reply', (data) => {
      console.log('log reply: ', JSON.stringify(data, null, 2));
    })

    wsClient.on('reconnecting', (data) => {
      setIsLoading(true)
      console.log('ws automatically reconnecting.... ', data?.wsKey);
    })

    wsClient.on('reconnected', (data) => {
      console.log('ws has reconnected ', data?.wsKey);
    })

    wsClient.on('error', (data) => {
      console.log('ws saw error ', data?.wsKey);
    })

    wsClient.subscribeKlines(symbol, '5m', 'usdm')

    updateInfo().then()
    const updateInfoTimeout = setInterval(() => {
      updateInfo().then()
    }, 2500)

    return () => {
      clearInterval(updateInfoTimeout)
      wsClient.closeAll()
    }
  }, [client])

  async function updateInfo() {
    if (client == undefined) {
      return
    }
    const openOrdersPromise = client.getAllOpenOrders({ symbol: symbol })
    const positionsPromise = client.getPositions({ symbol: symbol })

    try {
      const timeOffset = await client.fetchTimeOffset()
      client.setTimeOffset(timeOffset)
      const [openOrders, positions] = await Promise.all([openOrdersPromise, positionsPromise])

      setData(() => {
        return {
          positions: transformPositions(positions),
          openOrders: openOrders
        }
      })
      setIsLoading(() => false)
    } catch (e) {
      console.error("Error occurred:", e);
      setIsLoading(true)
    }
  }

  function transformPositions(positions) {
    let result = []
    positions.forEach((position) => {
      if (parseFloat(position.entryPrice) == 0) {
        return
      }
      result.push({
        size: Math.round(parseFloat(position.notional) * 100) / 100,
        positionAmt: position.positionAmt,
        entryPrice: position.entryPrice,
        profit: Math.round(parseFloat(position.unRealizedProfit) * 1e2) / 1e2,
        liquidation: position.liquidationPrice,
        margin: position.isolated ? 'isolated' : 'cross',
        positionSide: position.positionSide,
      })
    })
    return result
  }

  const [data, setData] = useState({
    positions: [],
    openOrders: [],
  })

  return (
    <>
      <div className="overflow-x-auto p-2">
        <Tabs>
          <Tab title="Position List">
            <>
              {isLoading && <Loading />}
              {!isLoading && <PositionTable positions={data.positions} client={client} symbol={symbol} />}
            </>
          </Tab>
          <Tab title="Order List">
            <>
              {isLoading && <Loading />}
              {!isLoading && <OrderTable orders={data.openOrders} client={client} symbol={symbol} />}
            </>
          </Tab>
        </Tabs>
      </div>
    </>
  )
}
