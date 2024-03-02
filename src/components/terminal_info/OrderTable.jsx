import OrderTableOrder from "./OrderTableOrder";

export default function OrderTable({ orders, client, symbol }) {

  const thClasses = "px-2 py-3"

  function cancelAll() {
    if (!confirm("Are you sure?")) {
      e.preventDefault();
    }
    client.cancelAllOpenOrders({ symbol: symbol })
      .then()
      .catch(err => { alert('something went wrong: ' + err.message), console.error(err) })
  }

  return (
    <>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs uppercase text-gray-400 bg-zinc-900">
          <tr>
            <th scope="col" className={thClasses}>
              Type
            </th>
            <th scope="col" className={thClasses}>
              Side
            </th>
            <th scope="col" className={thClasses}>
              Price
            </th>
            <th scope="col" className={thClasses}>
              Amount
            </th>
            <th scope="col" className={thClasses}>
              Filled
            </th>
            <th scope="col" className={thClasses + " text-center"}>
              Trigger
            </th>
            <th scope="col" className={thClasses}>
              <button onClick={cancelAll}>Cancel All</button>
            </th>
          </tr>
        </thead>
        <tbody className="bg-zinc-800">
          {orders.map(order => <OrderTableOrder key={order.orderId} order={order} thClasses={thClasses} client={client} />)}
        </tbody>
      </table>
    </>
  )
}
