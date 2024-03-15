export default function OrderTableOrder({ order, thClasses, client }) {

  function getFilled() {
    return localRound(parseFloat(order.price) * parseFloat(order.executedQty))
  }

  function getAmount() {
    if (order.closePosition) {
      return 'Close Position'
    }
    return localRound(parseFloat(order.price) * parseFloat(order.origQty))
  }

  function localRound(number) {
    return Math.round(number * 100) / 100
  }

  function cancel() {
    client.fetchTimeOffset()
      .then(timeOffset => {
        client.setTimeOffset(timeOffset)
        return client.cancelOrder({ symbol: order.symbol, orderId: order.orderId })
      })
      .then((result) => console.log('cancelled order: ' + result))
      .catch(err => { notifyError(err.message), console.error(err) })
  }

  return (
    <>
      <tr className="border-b border-zinc-700">
        <th scope="row" className={thClasses}>
          {order.type}
        </th>
        <td className={thClasses}>
          {order.side}
        </td>
        <td className={thClasses}>
          {order.price}
        </td>
        <td className={thClasses}>
          {getAmount()}
        </td>
        <td className={thClasses}>
          {getFilled()}
        </td>
        <td className={thClasses}>
          {order.stopPrice}
        </td>
        <td className={thClasses}>
          <button onClick={cancel}>🗑️</button>
        </td>
      </tr></>
  )
}
