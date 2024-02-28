export default function OrderTable({ positions }) {

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
          {positions.map((position) => {
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
    </>
  )
}
