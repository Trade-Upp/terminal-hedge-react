export default function Input({ label, children, type = 'text' }) {

  return (
    <>
      <div className="flex flex-row flex-nowrap p-2">
        <label className="basis-1/3">{label}</label>
        <label
          className="basis-2/3 hover:glow-label select-none">
          {children}
        </label>
      </div>
    </>
  )
}
