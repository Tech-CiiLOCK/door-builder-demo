// app/page.js
'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Viewer from '../components/Viewer';
import CameraControls from '../components/CameraControl';
import { MeshStandardMaterial, Color } from 'three';

export default function HomePage() {
    const [models, setModels] = useState([]);
    const [items, setItems] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [selectedModel, setSelectedModel] = useState(''); // Currently selected model
    const [selectedItem, setSelectedItem] = useState(''); // Currently selected item
    const [selectedMaterialId, setSelectedMaterialId] = useState(''); // Currently selected material
    const [orbitEnabled, setOrbitEnabled] = useState(true);

    const [modelScale, setModelScale] = useState({ x: 1, y: 1, z: 1 });

    const itemTargetSizes = {
        '/models/item1.glb': 30, // Mapping of item URLs to their target sizes
        '/models/dog.glb': 30,
    };

    // Fetch available models from the API on component mount
    useEffect(() => {
        fetch('/api/models')
            .then((res) => res.json())
            .then((data) => setModels(data));

        fetch('/api/items')
            .then((res) => res.json())
            .then((data) => setItems(data));

        fetch('/api/materials')
            .then((res) => res.json())
            .then((data) => {
                const transformedMaterials = data.map((item) => ({
                    ...item,
                    material: new MeshStandardMaterial({ color: new Color(item.material) })
                }));
                setMaterials(transformedMaterials);
            })
            .catch((error) => console.error('Error fetching materials:', error));
    }, []);

    // Handle change of selected model
    const handleModelChange = (e) => {
        setSelectedModel(e.target.value);
        setSelectedItem(''); // Reset item selection when model changes
        setSelectedMaterialId(''); // Reset material selection when model changes
        setModelScale({ x: 1, y: 1, z: 1 }); // Reset model scale when model changes
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

    const handleScaleChange = (axis, value) => {
        setModelScale(prevScale => ({
            ...prevScale,
            [axis]: value
        }));
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
                    <Viewer
                        key={selectedModel} // Re-render the ModelViewer when selectedModel changes
                        url={selectedModel}
                        itemUrl={selectedItem}
                        setOrbitEnabled={setOrbitEnabled}
                        selectedMaterialId={selectedMaterialId}
                        materials={materials}
                        itemTargetSizes={itemTargetSizes}
                        modelScale={modelScale}
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
                <div className="mt-4">
                    <h2 className="text-lg font-bold">Adjust Model Scale</h2>
                    <label className="block mt-2">
                        Width (X):
                        <input
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={modelScale.x}
                            onChange={(e) => handleScaleChange('x', e.target.value)}
                            className="block w-full"
                        />
                    </label>
                    <label className="block mt-2">
                        Height (Y):
                        <input
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={modelScale.y}
                            onChange={(e) => handleScaleChange('y', e.target.value)}
                            className="block w-full"
                        />
                    </label>
                    <label className="block mt-2">
                        Length (Z):
                        <input
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={modelScale.z}
                            onChange={(e) => handleScaleChange('z', e.target.value)}
                            className="block w-full"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}
