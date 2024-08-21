import React, { useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';

const CameraControls = ({ orbitEnabled }) => {
    const controlsRef = useRef(); // Reference to OrbitControls

    // Enable or disable OrbitControls based on the dragging state
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.enabled = orbitEnabled;
        }
    }, [orbitEnabled]);

    return <OrbitControls ref={controlsRef} />;
}

export default CameraControls;