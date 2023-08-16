import './App.css';
import Navbar from "./components/Navbar";
import * as React from "react";
import {Auth, generateId, useQueue} from "./helpers";
import MessageInput from "./components/MessageInput";
import PulseDotsLoader from "./components/PulseDotsLoader";


function LikeButton({liked, ...props}) {

  const iconClasses = liked ?  "w-4 h-4 align-middle inline fill-red-600 stroke-0" : "w-4 h-4 align-middle inline group-hover:fill-red-400 group-active:fill-red-600 group-hover:stroke-0"

  return (
    <button className='w-fit px-2 py-1 ml-4 mt-0.5 flex items-center rounded-lg group' {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={iconClasses}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      <span className={'text-xs ml-1'}>Like</span>
    </button>
  )
}

function App() {
  const auth = new Auth();
  const [messages, setMessagesState] = React.useState([]);
  const [isAuthenticated, setAuthenticated] = React.useState(auth.isAuthenticated());
  const [queue, {enqueue, dequeue}] = useQueue();
  const inputRef = React.useRef(); // user input element ref
  const containerRef = React.useRef(); // chat container element ref

  /**
   * Send message to Server via http api
   * @param {string} message
   */
  function sendMessage(message) {
    if (!message.length) return
    const tempMessageId = generateId();

    const payload = [...messages];
    const options = {
      method: 'POST',
      body: JSON.stringify(payload.map(row => ({message: row.content, fromMe: row.fromMe}))),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${auth.getAccessToken()}`
      }
    }
    setMessage('loading', false, tempMessageId, true);

    const req = new Request(`${process.env.REACT_APP_API_URL}/api/gpt`, options)
    fetch(req)
      .then(response => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 401) {
          setAuthenticated(false);
        }
        throw new Error(response.statusText)
      })
      .then(response => {
        setMessagesState(prevState => {
          return prevState.map((row) => {
            if (row.messageId === tempMessageId) {
              return {content: response.messages[0], fromMe: false, messageId: tempMessageId, chatId: response.chatId, loading: false, like: false}
            }
            return row;
          })
        })
      })
      .catch(error => {
        console.log('error')
        console.error(error)
      })

  }

  /**
   * @type SubmitMessageHandlerFunc
   */
  async function handleMessage(event) {
    if (!isAuthenticated) {
      return;
    }
    let msg = inputRef.current?.value;
    if (msg) {
      msg = msg.trim();
    }
    setMessage(msg);
    enqueue({message: msg})
  }

  /**
   * Update message state and clear input
   * @param {string} msg
   * @param {boolean} fromMe
   * @param {string} id
   * @param {boolean} loading
   */
  function setMessage(msg, fromMe=true, id=undefined, loading=false) {
    if (!msg.length) return;
    const messageId = id || generateId();
    setMessagesState((prevState) => ([...prevState, {
      content: msg,
      messageId,
      fromMe,
      loading,
    }]));
    const input = inputRef.current;
    input.value = '';
  }

  /**
   * @type KeyUpMessageHandlerFunc
   */
  function handleKeyUp(e) {
    // Send message If Enter key up
    if (e.key === 'Enter' || e.keyCode === 13) {
      handleMessage(e);
    }
  }

  /**
   *
   * @param {MouseEvent} e
   */
  function handleLike(e) {
    e.stopPropagation();
    if (!isAuthenticated) {
      return;
    }
    const elem = e.currentTarget;
    const chatId = elem.parentElement.dataset.chatid;
    messages.find(row => row.chatId === chatId && !row.like);
    const url = `${process.env.REACT_APP_API_URL}/api/gpt/${chatId}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${auth.getAccessToken()}`
      }
    }
    const req = new Request(url, options);

    fetch(req)
      .then(response => {
        if (response.status === 201) {
          // set like=true of message in data
          setMessagesState(prevState => {
            return prevState.map(row => {
              if (row.chatId === chatId) {
                row.like = true;
              }
              return row;
            })
          })
        } else if (response.status === 401) {
          setAuthenticated(false);
        } else {
          throw new Error();
        }
      })
      .catch(error => {
        window.alert("유효하지 않은 입력입니다.");
      })
  }

  /**
   * Send Message to API if enqueued.
   */
  React.useEffect(() => {
    const data = dequeue();
    if (data) {
      sendMessage(data.message);
    }
  }, [queue])

  /**
   * Clear input value if the user message's entered.
   */
  React.useEffect(() => {
    const objDiv = containerRef.current;
    objDiv.scrollTop = objDiv?.scrollHeight || 0;
  }, [messages]);

  return (
    <div id="container" className='h-full'>
      <Navbar currentPageIndex={0} />
      <div className="container h-full flex flex-wrap justify-center px-2 pt-5 mx-auto">
        <div className="flex flex-col w-full sm:w-[32rem] lg:w-[36rem] xl:w-2/3 bg-neutral-100 rounded-2xl h-[calc(100%-110px)] md:h-2/3">
          <div ref={containerRef} className='flex flex-col py-8 h-[calc(100%-78px)] overflow-y-auto'>
            {messages.map((message, idx) => (
              message.loading ? (
                <PulseDotsLoader id={message.messageId} key={message.messageId} />
              ) : (
                <div id={message.messageId} key={message.messageId} className="py-2 flex flex-col" data-chatid={message.chatId || ''}>
                  <div  className='mx-5'>
                    <div className={(message.fromMe ? 'ml-auto' : '') + ' relative balloon max-w-[80%] w-fit bg-neutral-300 rounded-md px-2 py-1'}>
                      {message.content}
                    </div>
                  </div>
                  {!message.fromMe && (
                    <LikeButton liked={message.like} onClick={handleLike} />
                  )}
                </div>
              )
            ))}
            {!isAuthenticated && (
              <div className='w-full bg-neutral-300 text-center text-sm mt-5'>사용자 인증이 만료되었습니다. 재로그인해주세요!</div>
            )}
          </div>
          <div className='mt-auto p-3'>
            <MessageInput onSubmit={handleMessage} onKeyUp={handleKeyUp} ref={inputRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
