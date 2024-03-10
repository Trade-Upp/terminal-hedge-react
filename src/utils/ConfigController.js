export function getConfigString() {
  let config = localStorage.getItem('config')
  if (config == null) {
    localStorage.setItem('config', getDefaultConfigString())
    config = beautifyConfigString(getDefaultConfigString())
  }
  return config
}

export function getConfigUnit(index) {
  const configJson = getValidConfigJson()
  return configJson[index]
}

export function setConfigUnit(index, configUnit) {
  const configJson = getValidConfigJson()
  configJson[index] = configUnit
  const configString = JSON.stringify(configJson, null, "\t")
  trySaveConfig(configString)
}

export function trySaveConfig(value) {
  if (!configValid(value)) {
    return
  }
  localStorage.setItem('config', value)
}

export function getValidConfigJson() {
  return JSON.parse(localStorage.getItem('config'))
}

function configValid(value) {
  try {
    const configJson = JSON.parse(value)
    if (!Array.isArray(configJson)) {
      return false
    }
    return configJson.every(configUnit => configUnitValid(configUnit))
  }
  catch (err) {
    return false
  }
}

function configUnitValid(configUnit) {
  return "label" in configUnit
    && "symbol" in configUnit
    && "API_KEY" in configUnit
    && "API_SECRET" in configUnit
    && "testnet" in configUnit
}

function minimizeConfigString(valueString) {
  return JSON.stringify(JSON.parse(valueString))
}

function beautifyConfigString(valueString) {
  return JSON.stringify(JSON.parse(valueString), null, "\t")
}

function getDefaultConfig() {
  return [
    {
      'label': 'Тестовий',
      'symbol': 'opusdt',
      'API_KEY': 'INPUT VALUE',
      'API_SECRET': 'INPUT VALUE',
      'testnet': false,
    }
  ]
}

function getDefaultConfigString() {
  return JSON.stringify(getDefaultConfig())
}
