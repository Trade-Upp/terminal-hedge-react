import React, { useState } from "react"

export default function Tabs({ children, saveIndexInStorageWithKey }) {

  const [tabIndex, setTabIndex] = useState(getFirstIndex())
  let activeContent

  function getFirstIndex() {
    if (saveIndexInStorageWithKey == undefined) {
      return 0
    }
    let index = localStorage.getItem(saveIndexInStorageWithKey)
    if (index == null) {
      index = 0
    }
    return index
  }

  function handleSetTabIndex(index) {
    setTabIndex(index)
    if (saveIndexInStorageWithKey == undefined) {
      return
    }
    localStorage.setItem(saveIndexInStorageWithKey, index)
  }

  return (
    <>
      <div className="text-sm font-medium text-center border-b text-gray-400 border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          {React.Children.map(children, (child, i) => {
            if (i == tabIndex) {
              activeContent = child.props.children
            }
            return React.cloneElement(child, {
              ...child.props,
              onClick: () => handleSetTabIndex(i),
              isActive: i == tabIndex
            });
          })}
        </ul>
      </div>
      {activeContent}
    </>
  )
}
