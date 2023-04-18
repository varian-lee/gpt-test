import * as React from "react";

/**
 * Keyup event handler for user message
 * @typedef {Function} KeyUpMessageHandlerFunc
 * @param {KeyboardEvent} event
 */


/**
 * Submit Event handler for user message
 * @typedef {Function} SubmitMessageHandlerFunc
 * @param {MouseEvent} event
 */

/**
 *
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<{readonly buttonText?: string, readonly onKeyUp?: KeyUpMessageHandlerFunc, readonly onSubmit?: SubmitMessageHandlerFunc, readonly placeholder?: string}> & React.RefAttributes<unknown>>}
 * @returns {JSX.Element}
 */

const MessageInput = React.forwardRef((props, ref) => {
  const {onKeyUp, onSubmit, placeholder = 'message', buttonText = 'send'} = props;
  return (
    <div>
      <label htmlFor="message"
             className="mb-2 text-sm font-medium text-gray-900 sr-only">{placeholder}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
               stroke="currentColor" className="w-6 h-6 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
          </svg>

        </div>
        <input type="message" id="message"
               className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
               placeholder="message" required onKeyUp={onKeyUp} ref={ref}/>
        <button type="submit" onClick={onSubmit}
                className="inline-flex items-center text-white absolute right-2.5 bottom-2.5 bg-black hover:bg-neutral-700 active:outline-neutral-600 focus:outline-none font-medium rounded-lg text-sm px-4 py-2">
          <span className='hidden sm:inline'>{buttonText}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
               stroke="currentColor" className="w-4 h-4 sm:ml-2">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
          </svg>
        </button>
      </div>
    </div>
  )
})

export default MessageInput;