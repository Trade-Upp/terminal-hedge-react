import { useState } from 'react'
import './App.css'
import Configuration from './components/Configuration'
import Tab from './components/Tab'
import Tabs from './components/Tabs'
import { getConfigString, getValidConfigJson, trySaveConfig } from './utils/ConfigController'
import Terminal from './components/Terminal'
import NotificationsComponent from './components/notifications/NotificationsComponent'

function App() {

  const [config, setConfig] = useState(getConfigString())

  function handleSetConfig(value) {
    setConfig(value)
    trySaveConfig(value)
  }

  const validConfigJson = getValidConfigJson()

  return (
    <>
      <NotificationsComponent />
      <Tabs saveIndexInStorageWithKey='app-tab-index'>
        <Tab title="Configuration">
          <Configuration config={config} setConfig={handleSetConfig} />
        </Tab>
        {validConfigJson.map((configUnit, index) => {
          return (
            <Tab key={index} title={configUnit.label}>
              <Terminal key={index} configIndex={index} />
            </Tab>
          )
        })}
      </Tabs>
    </>
  )
}

export default App
