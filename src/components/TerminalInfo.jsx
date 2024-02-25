import { USDMClient, WebsocketClient } from "binance"
import { useEffect, useState } from "react"

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
    const openOrders = await client.getAllOpenOrders({ symbol: symbol })
    const positions = await client.getPositions({ symbol: symbol })
    console.log('openOrders', openOrders);
    console.log('positions', positions);

    setData({
      positions: transformPositions(positions)
    })
  }

  function transformPositions(positions) {
    let result = []
    positions.forEach((position) => {
      if (parseFloat(position.entryPrice) == 0) {
        return
      }
      result.push({
        size: position.positionAmt,
        entryPrice: position.entryPrice,
        profit: position.unRealizedProfit,
        liquidation: position.liquidationPrice,
        margin: position.isolated ? 'isolated' : 'cross',
        positionSide: position.positionSide,
      })
    })
    return result
  }

  const [data, setData] = useState({
    positions: []
  })

  function getSizeClass(positionSide) {
    let result = "px-6 py-4 "
    if (positionSide == 'LONG') {
      result += "text-green-700"
    }
    else {
      result += "text-red-700"
    }
    return result
  }

  function getProfitClass(profit) {
    let result = "px-6 py-4 "
    if (profit > 0) {
      result += "text-green-700"
    }
    else {
      result += "text-red-700"
    }
    return result
  }

  return (
    <>
      <div className="overflow-x-auto p-2">
        <table className="thin-scrollbar w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase text-gray-400 bg-zinc-900">
            <tr>
              <th scope="col" className="px-6 py-3">
                Size
              </th>
              <th scope="col" className="px-6 py-3">
                Entry price
              </th>
              <th scope="col" className="px-6 py-3">
                Profit
              </th>
              <th scope="col" className="px-6 py-3">
                Liquidation
              </th>
              <th scope="col" className="px-6 py-3">
                Margin
              </th>
            </tr>
          </thead>
          <tbody className="bg-zinc-800">
            {data.positions.map((position) => {
              let sizeClass = getSizeClass(position.positionSide)
              let profitClass = getProfitClass(position.profit)
              return (
                <tr key={position.positionSide} className="border-b border-zinc-700">
                  <th scope="row" className={sizeClass}>
                    {position.size}
                  </th>
                  <td className="px-6 py-4">
                    {position.entryPrice}
                  </td>
                  <td className={profitClass}>
                    {position.profit}
                  </td>
                  <td className="px-6 py-4">
                    {position.liquidation}
                  </td>
                  <td className="px-6 py-4">
                    {position.margin}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
