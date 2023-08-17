import '../App.css';
import Navbar from "../components/Navbar";
import * as React from "react";
import VideoJS from "../components/Video";
import videojs from 'video.js';
import packageJson from '../../package.json';

function VideoTest() {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    // autoplay: true,
    controls: true,
    responsive: true,
    preload: 'auto',
    fluid: true,
    sources: [{
      src: packageJson.custom.media.videoUrl,
      type: 'video/mp4',
      //type: 'application/x-mpegURL'
    }]
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };


  return (
    <div id="container" className='h-full'>
      <Navbar currentPageIndex={1} />
      <div className="container h-full px-2 pt-5 mx-auto">
        <div className="text-center">
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
      </div>
    </div>
  );
}

export default VideoTest;
