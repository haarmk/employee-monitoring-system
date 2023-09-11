import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../constant/lotties/animate.json';
import { useEffect } from 'react';

export default function Animation() {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '-1600px' }}>
            <Lottie
                options={defaultOptions}
                height={400}
                width={400}
            />
        </div>
    );
}