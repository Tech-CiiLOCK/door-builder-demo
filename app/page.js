// 'use client';

// import { Canvas, useThree } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { MeshStandardMaterial, Box3, Vector3, Color } from 'three';
// import React, { useState, useEffect, useRef, useCallback } from 'react';

// function DraggableItem({ itemUrl, models, targetSize, itemSelectedMaterialId, itemMaterials }) {
//     const [items, setItems] = useState([]);

//     useEffect(() => {
//         if (itemUrl && models.length > 0) {
//             const loader = new GLTFLoader();
//             loader.load(itemUrl, (gltf) => {
//                 const itemScene = gltf.scene;

//                 // Apply selected material to item
//                 const selectedMaterial = itemMaterials.find(mat => mat.id === itemSelectedMaterialId)?.material;
//                 if (selectedMaterial) {
//                     itemScene.traverse((child) => {
//                         if (child.isMesh) {
//                             child.material = selectedMaterial;
//                         }
//                     });
//                 }

//                 const loadedItems = models.map((model) => {
//                     const itemClone = itemScene.clone();

//                     const box = new Box3().setFromObject(itemClone);
//                     const size = new Vector3();
//                     box.getSize(size);
//                     const scale = targetSize / Math.max(size.x, size.y, size.z);
//                     itemClone.scale.setScalar(scale);

//                     const positionOnTop = size.y * scale / 2;
//                     itemClone.position.set(0, positionOnTop, 0);

//                     model.add(itemClone);

//                     return itemClone;
//                 });

//                 setItems(loadedItems);
//             });
//         }
//     }, [itemUrl, models, targetSize, itemSelectedMaterialId, itemMaterials]);

//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (e.key === 'Shift') {
//                 if (items.length > 0) {
//                     const itemToRemove = items[items.length - 1];
//                     if (itemToRemove && itemToRemove.parent) {
//                         itemToRemove.parent.remove(itemToRemove);
//                         setItems((prevItems) => prevItems.slice(0, -1)); // Remove the last item from the state
//                     }
//                 }
//             }
//         };

//         window.addEventListener('keydown', handleKeyDown);

//         return () => {
//             window.removeEventListener('keydown', handleKeyDown);
//         };
//     }, [items]);

//     return null;
// }

// function CameraControls({ orbitEnabled, activeModel }) {
//     const controlsRef = useRef();
//     const { gl } = useThree();

//     const handleMouseMove = useCallback((e) => {
//         if (!activeModel) return;

//         const moveSpeed = 0.5;  // Increased move speed
//         const rotationSpeed = 0.01;

//         if (e.buttons === 2) { // Right-click for movement
//             activeModel.position.x += e.movementX * moveSpeed;
//             activeModel.position.y -= e.movementY * moveSpeed;
//         } else if (e.buttons === 1) { // Left-click for rotation
//             activeModel.rotation.y += e.movementX * rotationSpeed;
//             activeModel.rotation.x += e.movementY * rotationSpeed;
//         }
//     }, [activeModel]);

//     useEffect(() => {
//         if (controlsRef.current) {
//             controlsRef.current.enabled = orbitEnabled && !activeModel;
//         }

//         if (activeModel) {
//             gl.domElement.addEventListener('mousemove', handleMouseMove);
//         }

//         return () => {
//             if (activeModel) {
//                 gl.domElement.removeEventListener('mousemove', handleMouseMove);
//             }
//         };
//     }, [orbitEnabled, activeModel, handleMouseMove, gl.domElement]);

//     return <OrbitControls ref={controlsRef} />;
// }

// function ModelViewer({ url, itemUrl, setOrbitEnabled, selectedMaterialId, itemSelectedMaterialId, materials, itemMaterials, itemTargetSizes, showBothModels, setActiveModel }) {
//     const [model, setModel] = useState(null);
//     const [duplicateModel, setDuplicateModel] = useState(null);
//     const [actionMode, setActionMode] = useState(null);

//     const { camera, gl } = useThree();

//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (e.key === 'v') {
//                 setActionMode('move-duplicate'); // Activate move mode for duplicate model
//             } else if (e.key === 'c') {
//                 setActionMode('move-original'); // Activate move mode for original model
//             } else if (e.key === 'x') {
//                 setActionMode('rotate-duplicate'); // Activate rotate mode for duplicate model
//             } else if (e.key === 'z') {
//                 setActionMode('rotate-original'); // Activate rotate mode for original model
//             }
//         };

//         const handleKeyUp = (e) => {
//             if (['v', 'c', 'x', 'z'].includes(e.key)) {
//                 setActionMode(null); // Deactivate mode
//                 setActiveModel(null); // Clear active model when action mode is deactivated
//             }
//         };

//         const handleMouseDown = (e) => {
//             if (actionMode === 'move-duplicate' && e.buttons === 2) {
//                 setActiveModel(duplicateModel); // Set the duplicate model as active for movement
//             } else if (actionMode === 'move-original' && e.buttons === 2) {
//                 setActiveModel(model); // Set the original model as active for movement
//             } else if (actionMode === 'rotate-duplicate' && e.buttons === 1) {
//                 setActiveModel(duplicateModel); // Set the duplicate model as active for rotation
//             } else if (actionMode === 'rotate-original' && e.buttons === 1) {
//                 setActiveModel(model); // Set the original model as active for rotation
//             }
//         };

//         window.addEventListener('keydown', handleKeyDown);
//         window.addEventListener('keyup', handleKeyUp);
//         gl.domElement.addEventListener('mousedown', handleMouseDown);

//         return () => {
//             window.removeEventListener('keydown', handleKeyDown);
//             window.removeEventListener('keyup', handleKeyUp);
//             gl.domElement.removeEventListener('mousedown', handleMouseDown);
//         };
//     }, [actionMode, model, duplicateModel, gl.domElement, setActiveModel]);

//     useEffect(() => {
//         if (url) {
//             const loader = new GLTFLoader();
//             loader.load(url, (gltf) => {
//                 const scene = gltf.scene.clone();

//                 const box = new Box3().setFromObject(scene);
//                 const size = new Vector3();
//                 box.getSize(size);
//                 const maxDim = Math.max(size.x, size.y, size.z);
//                 const gap = maxDim * 1.0;

//                 scene.position.set(-gap / 4, 0, 0);
//                 setModel(scene);

//                 if (showBothModels) {
//                     const duplicateScene = gltf.scene.clone();
//                     duplicateScene.position.set(gap / 2, 0, 0);
//                     setDuplicateModel(duplicateScene);
//                 } else {
//                     setDuplicateModel(null);
//                 }

//                 const fov = camera.fov * (Math.PI / 180);
//                 let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
//                 camera.position.set(0, 0, cameraZ * 2);
//                 camera.lookAt(0, 0, 0);
//             });
//         }
//     }, [url, camera, showBothModels]);

//     useEffect(() => {
//         if (model && selectedMaterialId) {
//             const selectedMaterial = materials.find(mat => mat.id === selectedMaterialId)?.material;
//             if (selectedMaterial) {
//                 [model, duplicateModel].forEach((scene) => {
//                     scene?.traverse((child) => {
//                         if (child.isMesh) {
//                             child.material = selectedMaterial;
//                         }
//                     });
//                 });
//             }
//         }
//     }, [model, duplicateModel, selectedMaterialId, materials]);

//     const targetSize = itemTargetSizes[itemUrl] || 1;

//     return (
//         model && (
//             <>
//                 <primitive object={model} />
//                 {duplicateModel && <primitive object={duplicateModel} />}
//                 <DraggableItem
//                     itemUrl={itemUrl}
//                     models={duplicateModel ? [model, duplicateModel] : [model]}
//                     targetSize={targetSize}
//                     itemSelectedMaterialId={itemSelectedMaterialId}
//                     itemMaterials={itemMaterials}
//                 />
//             </>
//         )
//     );
// }

// export default function HomePage() {
//     const [models, setModels] = useState([]);
//     const [selectedModel, setSelectedModel] = useState('');
//     const [selectedItem, setSelectedItem] = useState('');
//     const [selectedMaterialId, setSelectedMaterialId] = useState('');
//     const [itemSelectedMaterialId, setItemSelectedMaterialId] = useState('');
//     const [orbitEnabled, setOrbitEnabled] = useState(true);
//     const [showBothModels, setShowBothModels] = useState(false);
//     const [activeModel, setActiveModel] = useState(null);

//     const items = [
//         { id: 'item1', name: 'Door Handle 1', modelUrl: '/models/item1.glb' },
//         { id: 'item2', name: 'Door Handle 2', modelUrl: '/models/item2.glb' },
//     ];

//     const materials = [
//         { id: 'mat1', name: 'Red', material: new MeshStandardMaterial({ color: new Color(0xff0000) }) },
//         { id: 'mat2', name: 'Green', material: new MeshStandardMaterial({ color: new Color(0x00ff00) }) },
//         { id: 'mat3', name: 'Blue', material: new MeshStandardMaterial({ color: new Color(0x0000ff) }) },
//     ];

//     const itemMaterials = [
//         { id: 'itemMat1', name: 'Gold', material: new MeshStandardMaterial({ color: new Color(0xffd700) }) },
//         { id: 'itemMat2', name: 'Silver', material: new MeshStandardMaterial({ color: new Color(0xc0c0c0) }) },
//         { id: 'itemMat3', name: 'Bronze', material: new MeshStandardMaterial({ color: new Color(0xcd7f32) }) },
//     ];

//     const itemTargetSizes = {
//         '/models/item1.glb': 30,
//         '/models/item2.glb': 30,
//     };

//     useEffect(() => {
//         fetch('/api/models')
//             .then((res) => res.json())
//             .then((data) => setModels(data));
//     }, []);

//     const handleModelChange = (e) => {
//         setSelectedModel(e.target.value);
//         setSelectedItem('');
//         setSelectedMaterialId('');
//         setItemSelectedMaterialId('');
//         setActiveModel(null);
//     };

//     const handleItemChange = (e) => {
//         const selectedItem = items.find(item => item.id === e.target.value);
//         setSelectedItem(selectedItem ? selectedItem.modelUrl : '');
//     };

//     const handleMaterialChange = (e) => {
//         setSelectedMaterialId(e.target.value);
//     };

//     const handleItemMaterialChange = (e) => {
//         setItemSelectedMaterialId(e.target.value);
//     };

//     const handleShowBothModelsChange = (e) => {
//         setShowBothModels(e.target.value === 'both');
//     };

//     return (
//         <div className="bg-white h-screen flex gap-8 items-center justify-center">
//             <div className="h-[700px] w-full max-w-3xl bg-white mt-2 ring-4 ring-slate-300">
//                 {!selectedModel && (
//                     <h1 className='text-3xl mt-40 font-bold text-gray-700 text-center'>
//                         Select something to show
//                     </h1>
//                 )}

//                 <Canvas camera={{ fov: 50 }}>
//                     <ambientLight />
//                     <CameraControls orbitEnabled={orbitEnabled} activeModel={activeModel} />
//                     <ModelViewer
//                         key={selectedModel}
//                         url={selectedModel}
//                         itemUrl={selectedItem}
//                         setOrbitEnabled={setOrbitEnabled}
//                         selectedMaterialId={selectedMaterialId}
//                         itemSelectedMaterialId={itemSelectedMaterialId}
//                         materials={materials}
//                         itemMaterials={itemMaterials}
//                         itemTargetSizes={itemTargetSizes}
//                         showBothModels={showBothModels}
//                         setActiveModel={setActiveModel}
//                     />
//                 </Canvas>
//             </div>

//             <div>
//                 <div>
//                     <h1 className="text-xl font-bold">Select a Model</h1>
//                     <select
//                         onChange={handleModelChange}
//                         value={selectedModel}
//                         className="mb-1 p-2 bg-black text-white rounded"
//                     >
//                         <option value="" disabled>
//                             Select a model
//                         </option>
//                         {models.map((model) => (
//                             <option key={model.id} value={model.url}>
//                                 {model.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <h1 className="text-xl font-bold">Select Display Mode</h1>
//                     <select
//                         onChange={handleShowBothModelsChange}
//                         className="mb-1 p-2 bg-black text-white rounded"
//                     >
//                         <option value="single">Single Model</option>
//                         <option value="both">Two Models</option>
//                     </select>
//                 </div>

//                 <div>
//                     <h2 className="text-lg font-bold mt-4">Select an Item</h2>
//                     <p>Use A/D W/S to rotate</p>
//                     <select
//                         onChange={handleItemChange}
//                         value={selectedItem}
//                         className="p-2 bg-black text-white rounded"
//                     >
//                         <option value="" disabled>
//                             Select an item
//                         </option>
//                         {items.map((item) => (
//                             <option key={item.id} value={item.id}>
//                                 {item.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <h2 className="text-lg font-bold mt-4">Select a Material for Model</h2>
//                     <select
//                         onChange={handleMaterialChange}
//                         value={selectedMaterialId}
//                         className="p-2 bg-black text-white rounded"
//                     >
//                         <option value="" disabled>
//                             Select a material
//                         </option>
//                         {materials.map((mat) => (
//                             <option key={mat.id} value={mat.id}>
//                                 {mat.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <h2 className="text-lg font-bold mt-4">Select a Material for Item</h2>
//                     <select
//                         onChange={handleItemMaterialChange}
//                         value={itemSelectedMaterialId}
//                         className="p-2 bg-black text-white rounded"
//                     >
//                         <option value="" disabled>
//                             Select a material
//                         </option>
//                         {itemMaterials.map((mat) => (
//                             <option key={mat.id} value={mat.id}>
//                                 {mat.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>
//         </div>
//     );
// }

'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshStandardMaterial, Box3, Vector3, Color } from 'three';
import React, { useState, useEffect, useRef, useCallback } from 'react';

function DraggableItem({ itemUrl, models, targetSize, itemSelectedMaterialId, itemMaterials }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (itemUrl && models.length > 0) {
            const loader = new GLTFLoader();
            loader.load(itemUrl, (gltf) => {
                const itemScene = gltf.scene;

                const selectedMaterial = itemMaterials.find(mat => mat.id === itemSelectedMaterialId)?.material;
                if (selectedMaterial) {
                    itemScene.traverse((child) => {
                        if (child.isMesh) {
                            child.material = selectedMaterial;
                        }
                    });
                }

                const loadedItems = models.map((model) => {
                    const itemClone = itemScene.clone();

                    const box = new Box3().setFromObject(itemClone);
                    const size = new Vector3();
                    box.getSize(size);
                    const scale = targetSize / Math.max(size.x, size.y, size.z);
                    itemClone.scale.setScalar(scale);

                    const positionOnTop = size.y * scale / 2;
                    itemClone.position.set(0, positionOnTop, 0);

                    model.add(itemClone);

                    return itemClone;
                });

                setItems(loadedItems);
            });
        }
    }, [itemUrl, models, targetSize, itemSelectedMaterialId, itemMaterials]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Shift') {
                if (items.length > 0) {
                    const itemToRemove = items[items.length - 1];
                    if (itemToRemove && itemToRemove.parent) {
                        itemToRemove.parent.remove(itemToRemove);
                        setItems((prevItems) => prevItems.slice(0, -1));
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [items]);

    return null;
}

function CameraControls({ orbitEnabled, activeModel }) {
    const controlsRef = useRef();
    const { gl } = useThree();

    const handleMouseMove = useCallback((e) => {
        if (!activeModel) return;

        const moveSpeed = 0.5;
        const rotationSpeed = 0.01;

        if (e.buttons === 2) { // Right-click for movement
            activeModel.position.x += e.movementX * moveSpeed;
            activeModel.position.y -= e.movementY * moveSpeed;
        } else if (e.buttons === 1) { // Left-click for rotation
            activeModel.rotation.y += e.movementX * rotationSpeed;
            activeModel.rotation.x += e.movementY * rotationSpeed;
        }
    }, [activeModel]);

    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.enabled = orbitEnabled && !activeModel;
        }

        if (activeModel) {
            gl.domElement.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (activeModel) {
                gl.domElement.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [orbitEnabled, activeModel, handleMouseMove, gl.domElement]);

    return <OrbitControls ref={controlsRef} />;
}

function ModelViewer({ url, itemUrl, setOrbitEnabled, selectedMaterialId, itemSelectedMaterialId, materials, itemMaterials, itemTargetSizes, showBothModels, setActiveModel }) {
    const [model, setModel] = useState(null);
    const [duplicateModel, setDuplicateModel] = useState(null);
    const [actionMode, setActionMode] = useState(null);

    const { camera, gl } = useThree();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'v') {
                setActionMode('move-duplicate'); // Activate move mode for duplicate model
            } else if (e.key === 'c') {
                setActionMode('move-original'); // Activate move mode for original model
            } else if (e.key === 'x') {
                setActionMode('rotate-duplicate'); // Activate rotate mode for duplicate model
            } else if (e.key === 'z') {
                setActionMode('rotate-original'); // Activate rotate mode for original model
            }
        };

        const handleKeyUp = (e) => {
            if (['v', 'c', 'x', 'z'].includes(e.key)) {
                setActionMode(null);
                setActiveModel(null);
            }
        };

        const handleMouseDown = (e) => {
            if (actionMode === 'move-duplicate' && e.buttons === 2) {
                setActiveModel(duplicateModel);
            } else if (actionMode === 'move-original' && e.buttons === 2) {
                setActiveModel(model);
            } else if (actionMode === 'rotate-duplicate' && e.buttons === 1) {
                setActiveModel(duplicateModel);
            } else if (actionMode === 'rotate-original' && e.buttons === 1) {
                setActiveModel(model);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        gl.domElement.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            gl.domElement.removeEventListener('mousedown', handleMouseDown);
        };
    }, [actionMode, model, duplicateModel, gl.domElement, setActiveModel]);

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

                scene.position.set(-gap / 4, 0, 0);
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
                <DraggableItem
                    itemUrl={itemUrl}
                    models={duplicateModel ? [model, duplicateModel] : [model]}
                    targetSize={targetSize}
                    itemSelectedMaterialId={itemSelectedMaterialId}
                    itemMaterials={itemMaterials}
                />
            </>
        )
    );
}

export default function HomePage() {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [itemSelectedMaterialId, setItemSelectedMaterialId] = useState('');
    const [orbitEnabled, setOrbitEnabled] = useState(true);
    const [showBothModels, setShowBothModels] = useState(false);
    const [activeModel, setActiveModel] = useState(null);

    const items = [
        { id: 'item1', name: 'Door Handle 1', modelUrl: '/models/item1.glb' },
        { id: 'item2', name: 'Door Handle 2', modelUrl: '/models/item2.glb' },
    ];

    const materials = [
        { id: 'mat1', name: 'Red', material: new MeshStandardMaterial({ color: new Color(0xff0000) }) },
        { id: 'mat2', name: 'Green', material: new MeshStandardMaterial({ color: new Color(0x00ff00) }) },
        { id: 'mat3', name: 'Blue', material: new MeshStandardMaterial({ color: new Color(0x0000ff) }) },
    ];

    const itemMaterials = [
        { id: 'itemMat1', name: 'Gold', material: new MeshStandardMaterial({ color: new Color(0xffd700) }) },
        { id: 'itemMat2', name: 'Silver', material: new MeshStandardMaterial({ color: new Color(0xc0c0c0) }) },
        { id: 'itemMat3', name: 'Bronze', material: new MeshStandardMaterial({ color: new Color(0xcd7f32) }) },
    ];

    const itemTargetSizes = {
        '/models/item1.glb': 30,
        '/models/item2.glb': 30,
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
        setItemSelectedMaterialId('');
        setActiveModel(null);
    };

    const handleItemChange = (itemUrl) => {
        setSelectedItem(itemUrl);
    };

    const handleMaterialChange = (e) => {
        setSelectedMaterialId(e.target.value);
    };

    const handleItemMaterialChange = (e) => {
        setItemSelectedMaterialId(e.target.value);
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
                    <CameraControls orbitEnabled={orbitEnabled} activeModel={activeModel} />
                    <ModelViewer
                        key={selectedModel}
                        url={selectedModel}
                        itemUrl={selectedItem}
                        setOrbitEnabled={setOrbitEnabled}
                        selectedMaterialId={selectedMaterialId}
                        itemSelectedMaterialId={itemSelectedMaterialId}
                        materials={materials}
                        itemMaterials={itemMaterials}
                        itemTargetSizes={itemTargetSizes}
                        showBothModels={showBothModels}
                        setActiveModel={setActiveModel}
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
                    <div className="flex space-x-2">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleItemChange(item.modelUrl)}
                                className={`p-2 bg-black text-white rounded ${selectedItem === item.modelUrl ? 'ring-4 ring-yellow-400' : ''}`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold mt-4">Select a Material for Model</h2>
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

                <div>
                    <h2 className="text-lg font-bold mt-4">Select a Material for Item</h2>
                    <select
                        onChange={handleItemMaterialChange}
                        value={itemSelectedMaterialId}
                        className="p-2 bg-black text-white rounded"
                    >
                        <option value="" disabled>
                            Select a material
                        </option>
                        {itemMaterials.map((mat) => (
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

