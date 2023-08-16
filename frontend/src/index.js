import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'video.js/dist/video-js.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SignIn from "./SignIn";
import {ProtectedRoute} from "./routers";
import VideoTest from "./pages/videoTest";
import TmpTest from "./pages/tmpTest";


const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><App /></ProtectedRoute>,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/test1",
    element: <VideoTest />,
  },
  {
    path: "/test2",
    element: <TmpTest />,
  }
  ]
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
