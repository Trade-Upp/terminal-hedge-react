import { useEffect, useState } from "react"

export default function Input({ label, children, updatableValue, getValueColor }) {

  const [value, setValue] = useState(getFirstValue())

  function getFirstValue() {
    if (updatableValue == undefined) {
      return children
    }
    return 'loading...'
  }

  useEffect(() => {
    if (updatableValue != undefined) {
      const updateValue = () => {
        updatableValue()
          .then((result) => {
            setValue(result)
          })
          .catch((err) => {
            setValueNotSync()
            console.error('error: ', err);
          })
      }

      const setValueNotSync = () => {
        if (value.endsWith('(not sync)')) {
          return;
        }
        setValue(value + ' (not sync)')
      }

      updateValue()
      const intervalUpdatingValue = setInterval(() => {
        updateValue()
      }, 10 * 1000)

      return () => {
        clearInterval(intervalUpdatingValue)
      }
    }
  }, [])

  const valueLabelStyle = getValueColor == undefined ? undefined : { color: getValueColor(value) }

  return (
    <>
      <div className="flex flex-row flex-nowrap p-2">
        <label className="basis-1/3">{label}</label>
        <label
          className="basis-2/3 hover:glow-label select-none" style={valueLabelStyle}>
          {value}
        </label>
      </div>
    </>
  )
}
