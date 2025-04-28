import React, { useEffect } from 'react';
import './preloader.css'

function Preloader() {
    return (
        <div id="preloader">
            <div className="status">
                <img src="/images/header/horoscope.gif" alt="loader" />
            </div>
        </div>
    );
}

export default Preloader;
