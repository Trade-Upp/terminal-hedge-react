import { useState } from "react"
import { roundPrice, roundQuantity } from "../../utils/ExchangeInfoUtil"

export default function PositionTablePosition({ position, thClasses, client, symbol }) {

  const [entryPriceInputValue, setEntryPriceInputValue] = useState(position.entryPrice)
  const [positionAmtInputValue, setPositionAmtInputValue] = useState(position.positionAmt)

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

  function getEntryPriceInputClass(value) {
    let result = "w-20"
    if (entryPriceInputValue < 0) {
      result += " input-invalid"
    }
    return result
  }

  let sizeClass = getSizeClass(position.positionSide)
  let profitClass = getProfitClass(position.profit)

  function closeMarket({ positionSide }) {
    const quantity = getQuantity()
    const side = getSide()
    roundQuantity(symbol, quantity)
      .then((roundedQuantity) => {
        const newOrderInfo = {
          symbol: symbol,
          side: side,
          positionSide: positionSide,
          type: 'MARKET',
          quantity: roundedQuantity,
        }
        return client.submitNewOrder(newOrderInfo)
      })
      .catch((err) => { alert('something went wrong: ' + err.message), console.error(err.message) })
      .then((result) => {
        console.log('new order info', result);
      })
      .catch(err => { alert('something went wrong: ' + err.message), console.error(err.message) })
  }

  function closeLimit({ positionSide }) {
    const quantity = getQuantity()
    const side = getSide()
    const price = getPrice()
    let roundedPrice
    roundPrice(symbol, price)
      .then((transformedPrice) => {
        roundedPrice = transformedPrice
        return roundQuantity(symbol, quantity)
      })
      .catch((err) => alert('something went wrong: ' + err.message))
      .then((roundedQuantity) => {
        const newOrderInfo = {
          symbol: symbol,
          side: side,
          positionSide: positionSide,
          type: 'LIMIT',
          quantity: roundedQuantity,
          price: roundedPrice
        }
        return client.submitNewOrder(newOrderInfo)
      })
      .catch((err) => { alert('something went wrong: ' + err.message), console.error(err.message) })
      .then((result) => {
        console.log('new order info', result);
      })
      .catch(err => { alert('something went wrong: ' + err.message), console.error(err.message) })
  }

  function getQuantity() {
    let positionSize = parseFloat(positionAmtInputValue)
    if (positionAmtInputValue.slice(-1) == '%') {
      positionSize = getPositionSizeFromPercent()
    }
    if (positionSize == 0) {
      positionSize = position.positionAmt
    }
    positionSize = Math.abs(positionSize)
    if (positionSize < 0) {
      alert('not allowed')
      throw new Error('positionSize must be greater than zero')
    }
    return positionSize
  }

  function getPrice() {
    return parseFloat(entryPriceInputValue)
  }

  function getSide() {
    if (parseFloat(position.positionAmt) > 0) {
      return 'SELL'
    }
    return 'BUY'
  }

  function getPositionSizeFromPercent() {
    const percent = parseFloat(positionAmtInputValue) / 100.0
    return position.positionAmt * percent
  }

  return (
    <>
      <tr className="border-b border-zinc-700">
        <th scope="row" className={sizeClass}>
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
        <td className={thClasses}>
          <button onClick={() => closeMarket(position)}>Market</button>
        </td>
        {/* TODO: test close limit */}
        <td className={thClasses}>
          <button onClick={() => closeLimit(position)}>Limit</button>
        </td>
        <td className={thClasses}>
          <input className={getEntryPriceInputClass()} value={entryPriceInputValue} type="number" step="any" onChange={(e) => setEntryPriceInputValue(e.target.value)} />
        </td>
        <td className={thClasses}>
          <input className="w-20" value={positionAmtInputValue} onChange={(e) => setPositionAmtInputValue(e.target.value)} />
        </td>
      </tr>
    </>
  )
}
