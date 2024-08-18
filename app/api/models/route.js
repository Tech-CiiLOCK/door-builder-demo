import { NextResponse } from 'next/server';

export async function GET() {
  const models = [
    { id: 1, name: 'Model 1', url: '/models/model2.glb' },
    { id: 2, name: 'Model 2', url: '/models/chair.glb' },
    // { id: 3, name: 'Model 3', url: '/models/model1.glb' },
  ];
  return NextResponse.json(models);
}
