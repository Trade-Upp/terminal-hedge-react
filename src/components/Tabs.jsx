import React, { useState } from "react"

export default function Tabs({ children }) {

  const [tabIndex, setTabIndex] = useState(0)
  let activeContent

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
              onClick: () => setTabIndex(i),
              isActive: i == tabIndex
            });
          })}
        </ul>
      </div>
      {activeContent}
    </>
  )
}
