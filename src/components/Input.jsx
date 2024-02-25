import { useState } from "react";

export default function Input({ label, type = 'text', localStorageKey, defaultValue }) {

  const [value, setValue] = useState(defaultValue == undefined ? '' : defaultValue)

  function onChange(event) {
    const newValue = getNewValue(event.target)
    setValue(newValue)
    if (localStorageKey != undefined) {
      localStorage.setItem(localStorageKey, newValue);
    }
  }

  function getNewValue(target) {
    if (type == 'checkbox') {
      return target.checked
    }
    return target.value
  }

  return (
    <>
      <div className="flex flex-row flex-nowrap p-2">
        <label className="md:basis-1/3 md:inline hidden">{label}</label>
        <input
          type={type}
          className="md:basis-2/3 w-full min-h-5"
          onChange={onChange}
          placeholder={label}
          value={value}
          checked={value === true || value === 'true'}></input>
      </div>
    </>
  )
}
