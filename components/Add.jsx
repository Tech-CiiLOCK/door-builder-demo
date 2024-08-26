import React, { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Box3, Vector3 } from 'three';

const Add = ({ itemUrl, model, targetSize, onItemLoaded }) => {
    useEffect(() => {
        if (itemUrl && model) {
            const loader = new GLTFLoader();
            loader.load(itemUrl, (gltf) => {
                const itemScene = gltf.scene;

                // Calculate bounding box and scale the item based on target size
                const box = new Box3().setFromObject(itemScene);
                const size = new Vector3();
                box.getSize(size);
                
                const scale = targetSize / Math.max(size.x, size.y, size.z);
                itemScene.scale.setScalar(scale);

                model.add(itemScene); // Add the item to the model
                onItemLoaded(itemScene); // Callback to pass the loaded item to the parent component
            });
        }
    }, [itemUrl, model, targetSize, onItemLoaded]);

    return null; // This component does not render anything visually
};

export default Add;
