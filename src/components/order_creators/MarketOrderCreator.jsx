import { useState } from "react"
import Input from "../Input"
import OpenLongShortButtons from "./OpenLongShortButtons"
import { roundQuantity } from "../../utils/ExchangeInfoUtil"
import { notifySuccess } from "../notifications/NotificationsComponent"

export default function MarketOrderCreator({ client, symbol }) {

  const [size, setSize] = useState()

  function handleOrder(positionSide) {
    const side = getSide(positionSide)
    let quantity
    let currentPrice

    client.fetchTimeOffset()
      .then(timeOffset => {
        client.setTimeOffset(timeOffset)
        return client.getSymbolPriceTicker({ symbol: symbol })
      })
      .catch(err => { notifyError(err.message), console.error(err) })
      .then(result => {
        currentPrice = parseFloat(result.price)
        return roundQuantity(symbol, size / currentPrice)
      })
      .catch(err => { notifyError(err.message), console.error(err) })
      .then(result => {
        quantity = result
        return client.submitNewOrder({
          symbol: symbol,
          positionSide: positionSide,
          side: side,
          type: 'MARKET',
          quantity: quantity
        })
      })
      .catch(err => { notifyError(err.message), console.error(err) })
      .then(result => { notifySuccess('ok'), console.log('new order info', result) })
      .catch(err => { notifyError(err.message), console.error(err) })
  }

  function getSide(positionSide) {
    if (positionSide == 'LONG') {
      return 'BUY'
    }
    return 'SELL'
  }

  return (
    <>
      <div className="mt-2">
        <Input label="Size" onChange={(e) => { setSize(e.target.value) }} />
        <OpenLongShortButtons
          onLongClick={() => handleOrder('LONG')}
          onShortClick={() => handleOrder('SHORT')} />
      </div>
    </>
  )
}
