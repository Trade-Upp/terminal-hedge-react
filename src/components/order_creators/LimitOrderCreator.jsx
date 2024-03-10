import { useState } from "react"
import Input from "../Input"
import OpenLongShortButtons from "./OpenLongShortButtons"
import { roundPrice, roundQuantity } from "../../utils/ExchangeInfoUtil"

export default function LimitOrderCreator({ client, symbol }) {

  const [size, setSize] = useState()
  const [price, setPrice] = useState()

  function handleOrder(positionSide) {
    const side = getSide(positionSide)
    let roundedPrice
    let quantity

    roundPrice(price)
      .then(result => {
        roundedPrice = result
        // XXX: in python there was `size / currentPrice`
        return roundQuantity(size / price)
      })
      .catch(err => { alert('something went wrong: ' + err.message), console.error(err) })
      .then(result => {
        quantity = result
        return client.fetchTimeOffset()
      })
      .catch(err => { alert('something went wrong: ' + err.message), console.error(err) })
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
      .catch(err => { alert('something went wrong: ' + err.message), console.error(err) })
      .then(result => console.log('new order info', result))
      .catch(err => { alert('something went wrong: ' + err.message), console.error(err) })
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
        <Input label="Size" onChange={() => setSize(e.target.value)} />
        <Input label="Price" onChange={() => setPrice(e.target.value)} />
        <OpenLongShortButtons
          onLongClick={() => handleOrder('LONG')}
          onShortClick={() => handleOrder('SHORT')} />
      </div>
    </>
  )
}
