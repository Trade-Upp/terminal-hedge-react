import OrderTablePosition from "./OrderTablePosition"

export default function OrderTable({ positions, client }) {

  const thClasses = "px-2 py-3"

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
          {positions.map((position) => <OrderTablePosition position={position} thClasses={thClasses} />)}
        </tbody>
      </table>
    </>
  )
}
