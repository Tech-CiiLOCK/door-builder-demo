// app/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshStandardMaterial, Box3, Vector3, Color } from 'three';


//original
// function DraggableItem({ itemUrl, model, setOrbitEnabled, targetSize }) {
//     const [item, setItem] = useState(null); // State to store the loaded item
//     const [dragging, setDragging] = useState(false); // State to track if the item is being dragged
//     const { camera, mouse } = useThree(); // Access camera and mouse from the Three.js context
//     const rotationSpeed = 0.1; // Speed of rotation when using arrow keys or WASD

//     useEffect(() => {
//         if (itemUrl && model) {
//             const loader = new GLTFLoader();
//             loader.load(itemUrl, (gltf) => {
//                 const itemScene = gltf.scene;

//                 // Calculate bounding box and scale the item based on target size
//                 const box = new Box3().setFromObject(itemScene);
//                 const size = new Vector3();
//                 box.getSize(size);
//                 const scale = targetSize / Math.max(size.x, size.y, size.z);
//                 itemScene.scale.setScalar(scale);

//                 setItem(itemScene); // Store the item in state
//                 model.add(itemScene); // Add the item to the model
//             });
//         }
//     }, [itemUrl, model, targetSize]);

//     // Handlers to manage dragging state and control OrbitControls
//     const handlePointerDown = () => {
//         setDragging(true);
//         setOrbitEnabled(false); // Disable OrbitControls while dragging
//     };

//     const handlePointerUp = () => {
//         setDragging(false);
//         setOrbitEnabled(true); // Re-enable OrbitControls after dragging
//     };

//     // Handle keydown events for rotating the item while dragging
//     const handleKeyDown = (event) => {
//         if (item && dragging) {
//             if (event.key === 'ArrowLeft' || event.key === 'a') {
//                 item.rotation.y += rotationSpeed;
//             } else if (event.key === 'ArrowRight' || event.key === 'd') {
//                 item.rotation.y -= rotationSpeed;
//             } else if (event.key === 'ArrowUp' || event.key === 'w') {
//                 item.rotation.x += rotationSpeed;
//             } else if (event.key === 'ArrowDown' || event.key === 's') {
//                 item.rotation.x -= rotationSpeed;
//             }
//         }
//     };

//     // Add and remove event listener for keydown events
//     useEffect(() => {
//         window.addEventListener('keydown', handleKeyDown);
//         return () => {
//             window.removeEventListener('keydown', handleKeyDown);
//         };
//     }, [dragging, item]);

//     // Update item position based on mouse position while dragging
//     useFrame(() => {
//         if (dragging && item) {
//             const vector = new Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
//             const dir = vector.sub(camera.position).normalize();
//             const distance = -camera.position.z / dir.z;
//             const pos = camera.position.clone().add(dir.multiplyScalar(distance));
//             item.position.copy(pos); // Move item to the calculated position
//         }
//     });

//     return (
//         item && (
//             <primitive
//                 object={item}
//                 onPointerDown={handlePointerDown}
//                 onPointerUp={handlePointerUp}
//             />
//         )
//     );
// }

// function ModelViewer({ url, itemUrl, setOrbitEnabled, selectedMaterialId, materials, itemTargetSizes }) {
//     const [model, setModel] = useState(null); // State to store the main model
//     const { camera } = useThree(); // Access the camera from the Three.js context

//     // Load the main model from the provided URL
//     useEffect(() => {
//         if (url) {
//             const loader = new GLTFLoader();
//             loader.load(url, (gltf) => {
//                 const scene = gltf.scene;
//                 setModel(scene); // Store the model in state

//                 // Center and position the model within the scene
//                 const box = new Box3().setFromObject(scene);
//                 const center = new Vector3();
//                 box.getCenter(center);
//                 scene.position.sub(center); // Center the model

//                 // Adjust camera position based on model size
//                 const size = new Vector3();
//                 box.getSize(size);
//                 const maxDim = Math.max(size.x, size.y, size.z);
//                 const fov = camera.fov * (Math.PI / 180);
//                 let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
//                 camera.position.set(0, 0, cameraZ * 1.5);
//                 camera.lookAt(center);
//             });
//         }
//     }, [url, camera]);

//     // Apply the selected material to the model
//     useEffect(() => {
//         if (model && selectedMaterialId) {
//             const selectedMaterial = materials.find(mat => mat.id === selectedMaterialId)?.material;
//             if (selectedMaterial) {
//                 model.traverse((child) => {
//                     if (child.isMesh) {
//                         child.material = selectedMaterial; // Update the material of each mesh
//                     }
//                 });
//             }
//         }
//     }, [model, selectedMaterialId, materials]);
//     const targetSize = itemTargetSizes[itemUrl] || 1; // Default target size if not defined
    
//     return (
//         model && (
//             <>
//                 <primitive object={model} />
//                 <DraggableItem itemUrl={itemUrl} model={model} setOrbitEnabled={setOrbitEnabled} targetSize={targetSize} />
//             </>
//         )
//     );
// }
//new feature ---------------

// function ModelViewer({ url, itemUrl, setOrbitEnabled, selectedMaterialId, materials, itemTargetSizes }) {
//     const [model, setModel] = useState(null); // State to store the main model
//     const [duplicateModel, setDuplicateModel] = useState(null); // State to store the duplicate model
//     const { camera } = useThree(); // Access the camera from the Three.js context

//     useEffect(() => {
//         if (url) {
//             const loader = new GLTFLoader();
//             loader.load(url, (gltf) => {
//                 const scene = gltf.scene.clone(); // Clone the scene for the first model
//                 const duplicateScene = gltf.scene.clone(); // Clone the scene for the duplicate model
                
//                 // Center and position the original model within the scene
//                 const box = new Box3().setFromObject(scene);
//                 const size = new Vector3();
//                 box.getSize(size);
//                 const maxDim = Math.max(size.x, size.y, size.z);
//                 const gap = maxDim * 1.0; // Adjust this gap for spacing

//                 // Position the original model to the left of the center
//                 scene.position.set(-gap / 4, 0, 0);

//                 // Position the duplicate model to the right of the original
//                 duplicateScene.position.set(gap / 2, 0, 0);

//                 // Adjust camera position based on the combined size
//                 const fov = camera.fov * (Math.PI / 180);
//                 let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
//                 camera.position.set(0, 0, cameraZ * 2); // Zoom out to fit both models
//                 camera.lookAt(0, 0, 0); // Look at the center point between the two models

//                 setModel(scene); // Store the original model in state
//                 setDuplicateModel(duplicateScene); // Store the duplicate model in state
//             });
//         }
//     }, [url, camera]);

//     useEffect(() => {
//         if (model && duplicateModel && selectedMaterialId) {
//             const selectedMaterial = materials.find(mat => mat.id === selectedMaterialId)?.material;
//             if (selectedMaterial) {
//                 [model, duplicateModel].forEach((scene) => {
//                     scene.traverse((child) => {
//                         if (child.isMesh) {
//                             child.material = selectedMaterial; // Update the material of each mesh
//                         }
//                     });
//                 });
//             }
//         }
//     }, [model, duplicateModel, selectedMaterialId, materials]);

//     const targetSize = itemTargetSizes[itemUrl] || 1; // Default target size if not defined

//     return (
//         model && duplicateModel && (
//             <>
//                 <primitive object={model} />
//                 <primitive object={duplicateModel} />
//                 <DraggableItem itemUrl={itemUrl} model={model} setOrbitEnabled={setOrbitEnabled} targetSize={targetSize} />
//             </>
//         )
//     );
// }

function DraggableItem({ itemUrl, models, targetSize }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (itemUrl && models.length > 0) {
            const loader = new GLTFLoader();
            loader.load(itemUrl, (gltf) => {
                const itemScene = gltf.scene;

                // Create instances of the item
                const loadedItems = models.map(model => {
                    const itemClone = itemScene.clone();

                    // Calculate bounding box and scale the items based on target size
                    const box = new Box3().setFromObject(itemClone);
                    const size = new Vector3();
                    box.getSize(size);
                    const scale = targetSize / Math.max(size.x, size.y, size.z);
                    itemClone.scale.setScalar(scale);

                    // Position the items on top of the models
                    const positionOnTop = size.y * scale / 2;
                    itemClone.position.set(0, positionOnTop, 0);

                    model.add(itemClone); // Add the item to the model

                    return itemClone;
                });

                setItems(loadedItems); // Store the items in state
            });
        }
    }, [itemUrl, models, targetSize]);

    return null; // No need to render anything directly since items are added to models
}

function ModelViewer({ url, itemUrl, setOrbitEnabled, selectedMaterialId, materials, itemTargetSizes, showBothModels }) {
    const [model, setModel] = useState(null);
    const [duplicateModel, setDuplicateModel] = useState(null);
    const { camera } = useThree();

    useEffect(() => {
        if (url) {
            const loader = new GLTFLoader();
            loader.load(url, (gltf) => {
                const scene = gltf.scene.clone();

                const box = new Box3().setFromObject(scene);
                const size = new Vector3();
                box.getSize(size);
                const maxDim = Math.max(size.x, size.y, size.z);
                const gap = maxDim * 1.0;

                scene.position.set(-gap / 6, 0, 0);
                setModel(scene);

                if (showBothModels) {
                    const duplicateScene = gltf.scene.clone();
                    duplicateScene.position.set(gap / 2, 0, 0);
                    setDuplicateModel(duplicateScene);
                } else {
                    setDuplicateModel(null);
                }

                const fov = camera.fov * (Math.PI / 180);
                let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                camera.position.set(0, 0, cameraZ * 2);
                camera.lookAt(0, 0, 0);
            });
        }
    }, [url, camera, showBothModels]);

    useEffect(() => {
        if (model && selectedMaterialId) {
            const selectedMaterial = materials.find(mat => mat.id === selectedMaterialId)?.material;
            if (selectedMaterial) {
                [model, duplicateModel].forEach((scene) => {
                    scene?.traverse((child) => {
                        if (child.isMesh) {
                            child.material = selectedMaterial;
                        }
                    });
                });
            }
        }
    }, [model, duplicateModel, selectedMaterialId, materials]);

    const targetSize = itemTargetSizes[itemUrl] || 1;

    return (
        model && (
            <>
                <primitive object={model} />
                {duplicateModel && <primitive object={duplicateModel} />}
                <DraggableItem itemUrl={itemUrl} models={duplicateModel ? [model, duplicateModel] : [model]} targetSize={targetSize} />
            </>
        )
    );
}

function CameraControls({ orbitEnabled }) {
    const controlsRef = useRef();

    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.enabled = orbitEnabled;
        }
    }, [orbitEnabled]);

    return <OrbitControls ref={controlsRef} />;
}

export default function HomePage() {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [orbitEnabled, setOrbitEnabled] = useState(true);
    const [showBothModels, setShowBothModels] = useState(false); // State to control single or both models display

    const items = [
        { id: 'item1', name: 'Door Handle 1', modelUrl: '/models/item1.glb' },
        { id: 'item2', name: 'Door Handle 2', modelUrl: '/models/dog.glb' },
    ];

    const materials = [
        { id: 'mat1', name: 'Red', material: new MeshStandardMaterial({ color: new Color(0xff0000) }) },
        { id: 'mat2', name: 'Green', material: new MeshStandardMaterial({ color: new Color(0x00ff00) }) },
        { id: 'mat3', name: 'Blue', material: new MeshStandardMaterial({ color: new Color(0x0000ff) }) },
    ];

    const itemTargetSizes = {
        '/models/item1.glb': 30,
        '/models/dog.glb': 30,
    };

    useEffect(() => {
        fetch('/api/models')
            .then((res) => res.json())
            .then((data) => setModels(data));
    }, []);

    const handleModelChange = (e) => {
        setSelectedModel(e.target.value);
        setSelectedItem('');
        setSelectedMaterialId('');
    };

    const handleItemChange = (e) => {
        const selectedItem = items.find(item => item.id === e.target.value);
        setSelectedItem(selectedItem ? selectedItem.modelUrl : '');
    };

    const handleMaterialChange = (e) => {
        setSelectedMaterialId(e.target.value);
    };

    const handleShowBothModelsChange = (e) => {
        setShowBothModels(e.target.value === 'both');
    };

    return (
        <div className="bg-white h-screen flex gap-8 items-center justify-center">
            <div className="h-[700px] w-full max-w-3xl bg-white mt-2 ring-4 ring-slate-300">
                {!selectedModel && (
                    <h1 className='text-3xl mt-40 font-bold text-gray-700 text-center'>
                        Select something to show
                    </h1>
                )}

                <Canvas camera={{ fov: 50 }}>
                    <ambientLight />
                    <CameraControls orbitEnabled={orbitEnabled} />
                    <ModelViewer
                        key={selectedModel}
                        url={selectedModel}
                        itemUrl={selectedItem}
                        setOrbitEnabled={setOrbitEnabled}
                        selectedMaterialId={selectedMaterialId}
                        materials={materials}
                        itemTargetSizes={itemTargetSizes}
                        showBothModels={showBothModels} // Pass whether to show both models
                    />
                </Canvas>
            </div>

            <div>
                <div>
                    <h1 className="text-xl font-bold">Select a Model</h1>
                    <select
                        onChange={handleModelChange}
                        value={selectedModel}
                        className="mb-1 p-2 bg-black text-white rounded"
                    >
                        <option value="" disabled>
                            Select a model
                        </option>
                        {models.map((model) => (
                            <option key={model.id} value={model.url}>
                                {model.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <h1 className="text-xl font-bold">Select Display Mode</h1>
                    <select
                        onChange={handleShowBothModelsChange}
                        className="mb-1 p-2 bg-black text-white rounded"
                    >
                        <option value="single">Single Model</option>
                        <option value="both">Two Models</option>
                    </select>
                </div>

                <div>
                    <h2 className="text-lg font-bold mt-4">Select an Item</h2>
                    <p>Use A/D W/S to rotate</p>
                    <select
                        onChange={handleItemChange}
                        value={selectedItem}
                        className="p-2 bg-black text-white rounded"
                    >
                        <option value="" disabled>
                            Select an item
                        </option>
                        {items.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <h2 className="text-lg font-bold mt-4">Select a Material</h2>
                    <select
                        onChange={handleMaterialChange}
                        value={selectedMaterialId}
                        className="p-2 bg-black text-white rounded"
                    >
                        <option value="" disabled>
                            Select a material
                        </option>
                        {materials.map((mat) => (
                            <option key={mat.id} value={mat.id}>
                                {mat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

