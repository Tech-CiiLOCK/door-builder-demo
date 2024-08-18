// app/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshStandardMaterial, Box3, Vector3, Color } from 'three';

function DraggableItem({ itemUrl, model, setOrbitEnabled, targetSize }) {
    const [item, setItem] = useState(null); // State to store the loaded item
    const [dragging, setDragging] = useState(false); // State to track if the item is being dragged
    const { camera, mouse } = useThree(); // Access camera and mouse from the Three.js context
    const rotationSpeed = 0.1; // Speed of rotation when using arrow keys or WASD

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

                setItem(itemScene); // Store the item in state
                model.add(itemScene); // Add the item to the model
            });
        }
    }, [itemUrl, model, targetSize]);

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
}

function ModelViewer({ url, itemUrl, setOrbitEnabled, selectedMaterialId, materials, itemTargetSizes }) {
    const [model, setModel] = useState(null); // State to store the main model
    const { camera } = useThree(); // Access the camera from the Three.js context

    // Load the main model from the provided URL
    useEffect(() => {
        if (url) {
            const loader = new GLTFLoader();
            loader.load(url, (gltf) => {
                const scene = gltf.scene;
                setModel(scene); // Store the model in state

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

    const targetSize = itemTargetSizes[itemUrl] || 1; // Default target size if not defined

    return (
        model && (
            <>
                <primitive object={model} />
                <DraggableItem itemUrl={itemUrl} model={model} setOrbitEnabled={setOrbitEnabled} targetSize={targetSize} />
            </>
        )
    );
}

function CameraControls({ orbitEnabled }) {
    const controlsRef = useRef(); // Reference to OrbitControls

    // Enable or disable OrbitControls based on the dragging state
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.enabled = orbitEnabled;
        }
    }, [orbitEnabled]);

    return <OrbitControls ref={controlsRef} />;
}

export default function HomePage() {
    const [models, setModels] = useState([]); // List of available models
    const [selectedModel, setSelectedModel] = useState(''); // Currently selected model
    const [selectedItem, setSelectedItem] = useState(''); // Currently selected item
    const [selectedMaterialId, setSelectedMaterialId] = useState(''); // Currently selected material
    const [orbitEnabled, setOrbitEnabled] = useState(true); // State to manage OrbitControls

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
        '/models/item1.glb': 30, // Mapping of item URLs to their target sizes
        '/models/dog.glb': 30,
    };

    // Fetch available models from the API on component mount
    useEffect(() => {
        fetch('/api/models')
            .then((res) => res.json())
            .then((data) => setModels(data));
    }, []);

    // Handle change of selected model
    const handleModelChange = (e) => {
        setSelectedModel(e.target.value);
        setSelectedItem(''); // Reset item selection when model changes
        setSelectedMaterialId(''); // Reset material selection when model changes
    };

    // Handle change of selected item
    const handleItemChange = (e) => {
        const selectedItem = items.find(item => item.id === e.target.value);
        setSelectedItem(selectedItem ? selectedItem.modelUrl : '');
    };

    // Handle change of selected material
    const handleMaterialChange = (e) => {
        setSelectedMaterialId(e.target.value);
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
                        key={selectedModel} // Re-render the ModelViewer when selectedModel changes
                        url={selectedModel}
                        itemUrl={selectedItem}
                        setOrbitEnabled={setOrbitEnabled}
                        selectedMaterialId={selectedMaterialId}
                        materials={materials}
                        itemTargetSizes={itemTargetSizes}
                    />
                </Canvas>
            </div>

            <div>
                <div>
                    <h1 className="text-xl font-bold">Select a Model</h1>
                    {/* Dropdown for selecting models */}
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
                    <h2 className="text-lg font-bold mt-4">Select an Item</h2>
                    <p>Use A/D W/S to rotate</p>
                    {/* Dropdown for selecting items */}
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
                    {/* Dropdown for selecting materials */}
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
