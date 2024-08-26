import React, { useEffect } from 'react';

const MaterialChanger = ({ item, selectedMaterialId, materials }) => {
    useEffect(() => {
        if (item && selectedMaterialId) {
            const selectedMaterial = materials.find(mat => mat.id === selectedMaterialId)?.material;
            if (selectedMaterial) {
                item.traverse((child) => {
                    if (child.isMesh) {
                        child.material = selectedMaterial; // Update the material of the selected item
                    }
                });
            }
        }
    }, [item, selectedMaterialId, materials]);

    return null; // This component does not render anything
};

export default MaterialChanger;
