import { USDMClient } from "binance";

const client = new USDMClient()
let exchangeInfo = null

export async function roundQuantity(symbol, quantity) {
  const info = await fetchExchangeInfo()
  const symbolInfo = info.symbols.find(symbolInfo => symbolInfo.symbol == symbol.toUpperCase())
  const quantityPrecision = symbolInfo.quantityPrecision
  const powerOf10 = Math.pow(10, quantityPrecision)
  return Math.round(parseFloat(quantity) * powerOf10) / powerOf10
}

function fetchExchangeInfo() {
  if (exchangeInfo == null) {
    exchangeInfo = client.getExchangeInfo()
  }
  return exchangeInfo
}
