import FileSort from '../file-sort'

export const Project = () => {
  return (
    <ul className='one m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]'>
      <FileSort />
    </ul>
  )
}
