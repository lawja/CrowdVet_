import React from 'react'
import ReactDOM from 'react-dom'
import './VideoPlayer.css'
import CVButton from '../../components/CVButton/CVButton'


const VideoPlayer = (props) => {
    return (
        <div className="video-player-wrapper">
            <iframe src={props.source} title="kiva video"></iframe>
        </div>
    );
};

export default VideoPlayer;
