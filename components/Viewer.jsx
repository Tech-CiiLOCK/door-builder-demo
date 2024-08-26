import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Box3, Vector3 } from 'three';
import Drag from './Drag';
import MaterialChanger from './MaterialChanger';

const Viewer = ({ url, items, setOrbitEnabled, selectedMaterialId, materials, itemTargetSizes, modelScale, removeMode }) => {
    const [model, setModel] = useState(null); // State to store the main model
    const [addedItems, setAddedItems] = useState([]); // State to store the added items
    const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item for material change
    const { camera, scene } = useThree(); // Access the camera and scene from the Three.js context

    // Load the main model from the provided URL
    useEffect(() => {
        if (url) {
            const loader = new GLTFLoader();
            loader.load(url, (gltf) => {
                const sceneModel = gltf.scene;
                setModel(sceneModel);
                scene.add(sceneModel);

                // Center and position the model within the scene
                const box = new Box3().setFromObject(sceneModel);
                const center = new Vector3();
                box.getCenter(center);
                sceneModel.position.sub(center); // Center the model

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
    }, [url, camera, scene]);

    // Add items to the scene when they are selected, only once
    useEffect(() => {
        if (items.length > 0 && model) {
            items.forEach((itemUrl) => {
                if (!addedItems.some(item => item.itemUrl === itemUrl)) {
                    const targetSize = itemTargetSizes[itemUrl] || 1; // Default target size if not defined
                    const loader = new GLTFLoader();
                    loader.load(itemUrl, (gltf) => {
                        const itemScene = gltf.scene;

                        // Scale the item
                        const box = new Box3().setFromObject(itemScene);
                        const size = new Vector3();
                        box.getSize(size);
                        const scale = targetSize / Math.max(size.x, size.y, size.z);
                        itemScene.scale.setScalar(scale);

                        model.add(itemScene); // Add the item to the model
                        setAddedItems((prevItems) => [...prevItems, { itemUrl, item: itemScene }]);
                    });
                }
            });
        }
    }, [items, model, addedItems, itemTargetSizes]);

    // Update the scale of the model based on user input
    useEffect(() => {
        if (model) {
            model.scale.set(modelScale.x, modelScale.y, modelScale.z);
        }
    }, [model, modelScale]);

    // Handle clicking on an item to select it
    const handleItemClick = (clickedItem) => {
        setSelectedItem(clickedItem);
        if (removeMode) {
            if (clickedItem && clickedItem.parent) {
                clickedItem.parent.remove(clickedItem);
            }
            setAddedItems((prevItems) => prevItems.filter((itemData) => itemData !== clickedItem));
        }

    };
    
    return (
        model && (
            <>
                <primitive object={model} />
                {addedItems.map((itemData, index) => (
                    <React.Fragment key={index}>
                        <primitive
                            object={itemData.item}
                            onClick={() => handleItemClick(itemData.item)} // Select item on click
                        />
                        <Drag
                            item={itemData.item}
                            setOrbitEnabled={setOrbitEnabled}
                        />
                    </React.Fragment>
                ))}
                {selectedItem && (
                    <MaterialChanger
                        item={selectedItem}
                        selectedMaterialId={selectedMaterialId}
                        materials={materials}
                    />
                )}
            </>
        )
    );
};

export default Viewer;
