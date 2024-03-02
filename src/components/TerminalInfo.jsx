import { USDMClient, WebsocketClient } from "binance"
import { useEffect, useState } from "react"
import PositionTable from "./terminal_info/PositionTable"
import OrderTable from "./terminal_info/OrderTable"
import Tabs from "./Tabs"
import Tab from "./Tab"

export default function TerminalInfo({ symbol, apiKey, apiSecret, testnet, client }) {

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
      updateInfo()
    })

    // read response to command sent via WS stream (e.g LIST_SUBSCRIPTIONS)
    wsClient.on('reply', (data) => {
      console.log('log reply: ', JSON.stringify(data, null, 2));
    })

    wsClient.on('reconnecting', (data) => {
      console.log('ws automatically reconnecting.... ', data?.wsKey);
    })

    wsClient.on('reconnected', (data) => {
      console.log('ws has reconnected ', data?.wsKey);
    })

    wsClient.on('error', (data) => {
      console.log('ws saw error ', data?.wsKey);
    })

    wsClient.subscribeKlines(symbol, '5m', 'usdm')

    const updateInfoTimeout = setTimeout(() => {
      updateInfo().then()
    }, 1500)

    return () => {
      clearTimeout(updateInfoTimeout)
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
      const [openOrders, positions] = await Promise.all([openOrdersPromise, positionsPromise])

      setData({
        positions: transformPositions(positions),
        openOrders: openOrders
      })
    } catch (e) {
      console.error("Error occurred:", error);
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
            <PositionTable positions={data.positions} client={client} symbol={symbol} />
          </Tab>
          <Tab title="Order List">
            <OrderTable orders={data.openOrders} client={client} symbol={symbol} />
          </Tab>
        </Tabs>
      </div>
    </>
  )
}
