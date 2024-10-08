import React, { useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

const Drag = ({ item, setOrbitEnabled }) => {
    const [dragging, setDragging] = useState(false); // State to track if the item is being dragged
    const { camera, mouse } = useThree(); // Access camera and mouse from the Three.js context
    const rotationSpeed = 0.1; // Speed of rotation when using arrow keys or WASD

    // Handlers to manage dragging state and control OrbitControls
    const handlePointerDown = () => {
        setDragging(true);
        setOrbitEnabled(false); // Disable OrbitControls while dragging
    };

    const handlePointerUp = () => {
        setDragging(false);
        setOrbitEnabled(true); // Re-enable OrbitControls after dragging
    };

    // Handle keydown events for rotating the item while dragging
    const handleKeyDown = (event) => {
        if (item && dragging) {
            if (event.key === 'ArrowLeft' || event.key === 'a') {
                item.rotation.y += rotationSpeed;
            } else if (event.key === 'ArrowRight' || event.key === 'd') {
                item.rotation.y -= rotationSpeed;
            } else if (event.key === 'ArrowUp' || event.key === 'w') {
                item.rotation.x += rotationSpeed;
            } else if (event.key === 'ArrowDown' || event.key === 's') {
                item.rotation.x -= rotationSpeed;
            }
        }
    };

    // Add and remove event listener for keydown events
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dragging, item]);

    // Update item position based on mouse position while dragging
    useFrame(() => {
        if (dragging && item) {
            const vector = new Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));
            item.position.copy(pos); // Move item to the calculated position
        }
    });

    return (
        item && (
            <primitive
                object={item}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
            />
        )
    );
};

export default Drag;
