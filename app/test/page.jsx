"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const Test = () => {
    const mountRef = useRef(null);
    const [model, setModel] = useState(null);
    const [scale, setScale] = useState({ x: 1, y: 1, z: 1 });

    useEffect(() => {
        // Initialize scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Load the GLTF model
        const loader = new GLTFLoader();
        loader.load("/models/item1.glb", (gltf) => {
            const loadedModel = gltf.scene;
            setModel(loadedModel);
            scene.add(loadedModel);

            // Center and position the model
            const box = new THREE.Box3().setFromObject(loadedModel);
            const center = new THREE.Vector3();
            box.getCenter(center);
            loadedModel.position.sub(center);

            // Adjust camera based on model size
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            camera.position.set(0, 0, cameraZ * 1.5);
            camera.lookAt(center);

            animate();
        });

        const animate = () => {
            requestAnimationFrame(animate);
            if (model) {
                model.scale.set(scale.x, scale.y, scale.z);
            }
            renderer.render(scene, camera);
        };

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [scale]);

    const handleScaleChange = (axis, value) => {
        setScale(prevScale => ({ ...prevScale, [axis]: parseFloat(value) }));
    };

    return (
        <div>
            <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
            <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                <div>
                    <label htmlFor="scaleX">Width:</label>
                    <input
                        type="range"
                        id="scaleX"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={scale.x}
                        onChange={(e) => handleScaleChange('x', e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="scaleY">Height:</label>
                    <input
                        type="range"
                        id="scaleY"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={scale.y}
                        onChange={(e) => handleScaleChange('y', e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="scaleZ">Length:</label>
                    <input
                        type="range"
                        id="scaleZ"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={scale.z}
                        onChange={(e) => handleScaleChange('z', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Test;
