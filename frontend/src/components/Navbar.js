import * as React from 'react';
import {Auth} from "../helpers";
import {useNavigate, Link} from "react-router-dom";

function Hamburger(props) {
  return (
    <button data-collapse-toggle="navbar-default" type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-default" aria-expanded="false" {...props}>
      <span className="sr-only">Open main menu</span>
      <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
           xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"></path>
      </svg>
    </button>
  )
}

export default function Navbar () {
  const navigate = useNavigate();
  const menuRef = React.useRef();

  function handleLogout() {
    const auth = new Auth();
    auth.delAccessToken();
    navigate('/login');
  }

  function handleClickHamburger() {
    if (menuRef.current) {
      menuRef.current.classList.toggle('hidden');
    }
  }

  return (

    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-bold whitespace-nowrap">logo4</span>
        </Link>
        <Hamburger onClick={handleClickHamburger} />
        <div ref={menuRef} className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul
            className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
            <li>
              <button type={"button"}
                      className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                      onClick={handleLogout}
              >Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  )
}