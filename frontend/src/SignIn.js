import * as React from 'react';
import {Auth} from "./helpers";
import {useNavigate} from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  /**
   * set username if username input value changed
   * @param {InputEvent} e
   */
  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  /**
   * set password if password input value changed
   * @param {InputEvent} e
   */
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  /**
   * post request login api
   * @param {FormDataEvent} ev
   */
  function handleSubmit(ev) {
    ev.preventDefault();
    if (!username || !password) {
      window.alert("ID 혹은 PW를 입력해주세요");
      return;
    }   
    window.newrelic.setUserId(username);
    window.newrelic.setCustomAttribute('password', password);

    const url = `${process.env.REACT_APP_API_URL}/api/login`;
    const options = {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-Type': 'application/json'},
    }
    const req = new Request(url, options)
    fetch(req)
      .then(resp => {
        if (resp.status === 201) {
          return resp.json();
        } else {
          throw new Error(resp.statusText)
        }
      })
      .then(response => {
        console.log('OK');
        (new Auth()).setAccessToken(response.access_token);
        navigate("/");

      })
      .catch(error => {
        window.alert("ID 혹은 PW를 확인해주세요.")
      })
  }

  return (
    <div className={`flex flex-col items-center justify-center bg-white h-full`}>
      <a href="/" className="flex items-center">
        <span className="self-center text-xl font-bold whitespace-nowrap">Testing GPT App - NR</span>
      </a>

      <form className={`w-80 mt-5`} onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">ID</label>
          <input type="text" id="username" minLength={1} maxLength={20}
                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-neutral-700 focus:border-neutral-700 focus:outline-black block w-full p-2.5"
                 placeholder="your username" required value={username} onChange={handleUsernameChange} />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">PW</label>
          <input type="password" id="password"
                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-black block w-full p-2.5"
                 required value={password} onChange={handlePasswordChange} placeholder='your password' />
        </div>
        <button type="submit"
                className="text-white bg-black hover:bg-neutral-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Login
        </button>
      </form>

    </div>
  )
}