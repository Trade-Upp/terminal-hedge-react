import { useState } from "react"
import Input from "../Input"
import OpenLongShortButtons from "./OpenLongShortButtons"
import { roundPrice, roundQuantity } from "../../utils/ExchangeInfoUtil"
import { notifyError, notifySuccess } from "../notifications/NotificationsComponent"

export default function LimitOrderCreator({ client, symbol }) {

  const [size, setSize] = useState()
  const [price, setPrice] = useState()

  function handleOrder(positionSide) {
    const side = getSide(positionSide)
    let roundedPrice
    let quantity

    roundPrice(symbol, price)
      .then(result => {
        roundedPrice = result
        // XXX: in python there was `size / currentPrice`
        return roundQuantity(symbol, size / price)
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
          price: roundedPrice,
          type: 'LIMIT',
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
        <Input label="Price" onChange={(e) => setPrice(e.target.value)} />
        <OpenLongShortButtons
          onLongClick={() => handleOrder('LONG')}
          onShortClick={() => handleOrder('SHORT')} />
      </div>
    </>
  )
}
