import * as React from "react";

/**
 * Pulse dots element loader
 * @returns {JSX.Element}
 */
export default function PulseDotsLoader(props) {
  return (
    <div className="py-2 flex flex-col" {...props}>
      <div className='mx-5'>
        <div className=' relative balloon max-w-[80%] w-fit bg-neutral-300 rounded-md px-10 py-3'>
          <div className={'dot-elastic'}></div>
        </div>
      </div>
    </div>
  )
}