import LoadingSvg from '../assets/loading.svg'

export default function Loading() {
  return (
    <>
      <div className='flex justify-center items-center m-auto'>
        <img src={LoadingSvg} className='w-20' />
      </div>
    </>
  )
} 
