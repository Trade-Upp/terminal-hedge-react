import { useEffect, useState } from "react"

export default function Input({ label, children, updatableValue }) {

  const [value, setValue] = useState(getFirstValue())

  function getFirstValue() {
    if (updatableValue == undefined) {
      return children
    }
    return 'loading...'
  }

  if (updatableValue != undefined) {
    useEffect(() => {

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
    }, [])
  }

  return (
    <>
      <div className="flex flex-row flex-nowrap p-2">
        <label className="basis-1/3">{label}</label>
        <label
          className="basis-2/3 hover:glow-label select-none">
          {value}
        </label>
      </div>
    </>
  )
}
