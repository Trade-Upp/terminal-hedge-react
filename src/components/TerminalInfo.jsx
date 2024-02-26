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
        size: parseFloat(position.positionAmt) * parseFloat(position.leverage),
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
    positions: []
  })

  const thClasses = "px-2 py-3"

  function getSizeClass(positionSide) {
    let result = thClasses + " "
    if (positionSide == 'LONG') {
      result += "text-green-700"
    }
    else {
      result += "text-red-700"
    }
    return result
  }

  function getProfitClass(profit) {
    let result = thClasses + " "
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
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase text-gray-400 bg-zinc-900">
            <tr>
              <th scope="col" className={thClasses}>
                Size
              </th>
              <th scope="col" className={thClasses}>
                Entry price
              </th>
              <th scope="col" className={thClasses}>
                Profit
              </th>
              <th scope="col" className={thClasses}>
                Liquidation
              </th>
              <th scope="col" className={thClasses}>
                Margin
              </th>
              <th scope="col" colSpan={2} className={thClasses + " text-center"}>
                Close position
              </th>
              <th scope="col" className={thClasses}>
                Price
              </th>
              <th scope="col" className={thClasses}>
                Size
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
                    {/* TODO: size is wrong */}
                    {position.size}
                  </th>
                  <td className={thClasses}>
                    {position.entryPrice}
                  </td>
                  <td className={profitClass}>
                    {position.profit}
                  </td>
                  <td className={thClasses}>
                    {position.liquidation}
                  </td>
                  <td className={thClasses}>
                    {position.margin}
                  </td>
                  {/* TODO: copy functionality from python terminal */}
                  <td className={thClasses}>
                    <button>Market</button>
                  </td>
                  <td className={thClasses}>
                    <button>Limit</button>
                  </td>
                  <td className={thClasses}>
                    <input className="w-20" value={position.entryPrice} />
                  </td>
                  <td className={thClasses}>
                    <input className="w-20" value={position.positionAmt} />
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
