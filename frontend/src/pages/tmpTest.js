import '../App.css';
import Navbar from "../components/Navbar";
import * as React from "react";

function TmpTest() {

  return (
    <div id="container" className='h-full'>
      <Navbar currentPageIndex={2} />
      <div className="container h-full px-2 pt-5 mx-auto">
        <div className="text-center">
          <h1>TEST 2 Page</h1>
        </div>
      </div>
    </div>
  );
}

export default TmpTest;
