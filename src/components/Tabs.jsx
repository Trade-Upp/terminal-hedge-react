export default function Tabs({ children }) {
  return (
    <div class="text-sm font-medium text-center border-b text-gray-400 border-gray-700">
      <ul class="flex flex-wrap -mb-px">
        {children}
      </ul>
    </div>
  )
}
