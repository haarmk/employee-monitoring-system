import React from 'react';
import "./AnimateTemplate.css"
import Lottie from 'react-lottie';
import animationData from '../../constant/lotties/home-template.json';


export default function AnimateTemplate() {
   
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div className='lottie-animation' style={{ display: 'flex', justifyContent: 'center'}}>
            <Lottie
                options={defaultOptions}
            />
        </div>
    );
}

