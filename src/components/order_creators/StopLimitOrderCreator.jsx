import { useState } from "react"
import Input from "../Input"
import OpenLongShortButtons from "./OpenLongShortButtons"
import { roundPrice, roundQuantity } from "../../utils/ExchangeInfoUtil"
import { notifySuccess } from "../notifications/NotificationsComponent"

export default function StopLimitOrderCreator({ client, symbol }) {

  const [size, setSize] = useState()
  const [price, setPrice] = useState()
  const [stopPrice, setStopPrice] = useState()

  function handleOrder(positionSide) {
    const side = getSide(positionSide)
    let roundedPrice
    let roundedStopPrice
    let quantity
    roundPrice(symbol, price)
      .then(result => {
        roundedPrice = result
        return roundPrice(symbol, stopPrice)
      })
      .catch(err => { notifyError(err.message), console.error(err) })
      .then(result => {
        roundedStopPrice = result
        return roundQuantity(symbol, size / price)
      })
      .catch(err => { notifyError(err.message), console.error(err) })
      .then(result => {
        quantity = result
        return client.fetchTimeOffset()
      })
      .catch(err => { notifyError(err.message), console.error(err) })
      .then(timeOffset => {
        client.setTimeOffset(timeOffset)
        return client.submitNewOrder({
          symbol: symbol,
          side: side,
          positionSide: positionSide,
          type: 'STOP',
          stopPrice: roundedStopPrice,
          price: roundedPrice,
          timeInForce: 'GTC',
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
        <Input label="Size" onChange={(e) => setSize(e.target.value)} />
        <Input label="Price" onChange={(e) => setPrice(e.target.value)} />
        <Input label="Stop Price" onChange={(e) => setStopPrice(e.target.value)} />
        <OpenLongShortButtons
          onLongClick={() => handleOrder('LONG')}
          onShortClick={() => handleOrder('SHORT')} />
      </div>
    </>
  )
}
