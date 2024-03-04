export default function ContentContainer({ children }) {
  return (
    <>
      <div className='container mx-auto container-bg rounded mt-4'>
        {children}
      </div>
    </>
  )
}
