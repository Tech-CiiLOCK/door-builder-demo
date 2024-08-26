import { NextResponse } from 'next/server';

export async function GET() {
    const materials = [
        { id: 'mat1', name: 'Red', material: 0xff0000 },
        { id: 'mat2', name: 'Green', material: 0x00ff00 },
        { id: 'mat3', name: 'Blue', material: 0x0000ff },
    ];
    return NextResponse.json(materials);
}