import { NextResponse } from 'next/server';

export async function GET() {
    const items = [
        { id: 'item1', name: 'Door Handle 1', modelUrl: '/models/item1.glb' },
        { id: 'item2', name: 'Door Handle 2', modelUrl: '/models/dog.glb' },
    ];
    return NextResponse.json(items);
  }