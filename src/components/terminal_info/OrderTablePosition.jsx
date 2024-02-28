import { useState } from "react"

export default function OrderTablePosition({ position, thClasses }) {

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

  return (
    <>
      <tr key={position.positionSide} className="border-b border-zinc-700">
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
        {/* TODO: copy functionality from python terminal */}
        <td className={thClasses}>
          <button>Market</button>
        </td>
        <td className={thClasses}>
          <button>Limit</button>
        </td>
        <td className={thClasses}>
          <input className={getEntryPriceInputClass()} value={entryPriceInputValue} type="number" step="any" onChange={(e) => setEntryPriceInputValue(e.target.value)} />
        </td>
        <td className={thClasses}>
          <input className="w-20" value={positionAmtInputValue} type="number" step="any" onChange={(e) => setPositionAmtInputValue(e.target.value)} />
        </td>
      </tr>
    </>
  )

}
