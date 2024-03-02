export default function OpenLongShortButtons({ onLongClick, onShortClick }) {
  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-grow">
          <button className="w-full m-2" onClick={onLongClick}>Open Long</button>
        </div>
        <div className="flex flex-grow">
          <button className="w-full m-2" onClick={onShortClick}>Open Short</button>
        </div>
      </div>
    </>
  )
}
