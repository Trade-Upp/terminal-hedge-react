import { useState } from "react"
import Input from "../Input"
import OpenLongShortButtons from "./OpenLongShortButtons"
import { roundPrice, roundQuantity } from "../../utils/ExchangeInfoUtil"
import { notifyError, notifySuccess } from "../notifications/NotificationsComponent"

export default function StopMarketOrderCreator({ client, symbol }) {

  const [size, setSize] = useState()
  const [stopPrice, setStopPrice] = useState()

  function handleOrder(positionSide) {
    const side = getSide(positionSide)
    let roundedStopPrice
    let quantity

    roundPrice(symbol, stopPrice)
      .then(result => {
        roundedStopPrice = result
        return roundQuantity(symbol, size / stopPrice)
      })
      .then(result => {
        quantity = result
        return client.fetchTimeOffset()
      })
      .then(timeOffset => {
        client.setTimeOffset(timeOffset)
        return client.submitNewOrder({
          symbol: symbol,
          side: side,
          positionSide: positionSide,
          stopPrice: roundedStopPrice,
          type: 'STOP_MARKET',
          timeInForce: 'GTC',
          quantity: quantity
        })
      })
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
        <Input label="Size" onChange={(e) => setSize(e.target.value)} />
        <Input label="Stop Price" onChange={(e) => setStopPrice(e.target.value)} />
        <OpenLongShortButtons
          onLongClick={() => handleOrder('LONG')}
          onShortClick={() => handleOrder('SHORT')} />
      </div>
    </>
  )
}
