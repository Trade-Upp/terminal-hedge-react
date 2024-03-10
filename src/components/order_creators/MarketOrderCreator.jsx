import { useState } from "react"
import Input from "../Input"
import OpenLongShortButtons from "./OpenLongShortButtons"
import { roundQuantity } from "../../utils/ExchangeInfoUtil"

export default function MarketOrderCreator({ client, symbol }) {

  const [size, setSize] = useState()

  function handleOrder(positionSide) {
    const side = getSide(positionSide)
    let quantity
    let currentPrice

    client.getSymbolPriceTicker({ symbol: symbol })
      .then(result => {
        currentPrice = parseFloat(result.price)
        return roundQuantity(symbol, size / currentPrice)
      })
      .catch(err => { alert('something went wrong: ' + err.message), console.error(err) })
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
        <Input label="Size" onChange={(e) => { setSize(e.target.value) }} />
        <OpenLongShortButtons
          onLongClick={() => handleOrder('LONG')}
          onShortClick={() => handleOrder('SHORT')} />
      </div>
    </>
  )
}