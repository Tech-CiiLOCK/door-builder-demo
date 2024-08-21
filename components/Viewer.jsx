import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Box3, Vector3 } from 'three';
import Drag from './Drag';

const Viewer = ({ url, itemUrl, setOrbitEnabled, selectedMaterialId, materials, itemTargetSizes, modelScale }) => {
    const [model, setModel] = useState(null); // State to store the main model
    const { camera } = useThree(); // Access the camera from the Three.js context

    // Load the main model from the provided URL
    useEffect(() => {
        if (url) {
            const loader = new GLTFLoader();
            loader.load(url, (gltf) => {
                const scene = gltf.scene;
                setModel(scene);

                // Center and position the model within the scene
                const box = new Box3().setFromObject(scene);
                const center = new Vector3();
                box.getCenter(center);
                scene.position.sub(center); // Center the model

                // Adjust camera position based on model size
                const size = new Vector3();
                box.getSize(size);
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                camera.position.set(0, 0, cameraZ * 1.5);
                camera.lookAt(center);
            });
        }
    }, [url, camera]);

    // Apply the selected material to the model
    useEffect(() => {
        if (model && selectedMaterialId) {
            const selectedMaterial = materials.find(mat => mat.id === selectedMaterialId)?.material;
            if (selectedMaterial) {
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.material = selectedMaterial; // Update the material of each mesh
                    }
                });
            }
        }
    }, [model, selectedMaterialId, materials]);

    const targetSize = itemTargetSizes[itemUrl] || 1; // Default target size 1 if not defined

    useEffect(() => {
        if (model) {
            model.scale.set(modelScale.x, modelScale.y, modelScale.z);
        }
    }, [model, modelScale]);
    
    return (
        model && (
            <>
                <primitive object={model} />
                <Drag itemUrl={itemUrl} model={model} setOrbitEnabled={setOrbitEnabled} targetSize={targetSize} />
            </>
        )
    );
}

export default Viewer;