import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - All bus VTs
export async function GET() {
  try {
    const vts = await db.busVT.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(vts);
  } catch (error) {
    console.error('Error fetching bus VTs:', error);
    return NextResponse.json({ error: 'Error al obtener VTs' }, { status: 500 });
  }
}

// PUT - Update a VT's frequencies
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, frecuencias } = body;

    if (!code || !Array.isArray(frecuencias)) {
      return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 });
    }

    const updated = await db.busVT.update({
      where: { code },
      data: { frecuencias: frecuencias as any },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating bus VT:', error);
    return NextResponse.json({ error: 'Error al actualizar VT' }, { status: 500 });
  }
}
