import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/auth — Login by PIN
export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json();

    if (!pin || pin.length < 4) {
      return NextResponse.json({ error: 'PIN invalido' }, { status: 400 });
    }

    const persona = await db.persona.findUnique({
      where: { pin },
    });

    if (!persona) {
      return NextResponse.json({ error: 'PIN no encontrado' }, { status: 401 });
    }

    // Return user data (no JWT needed — session stored in localStorage)
    return NextResponse.json({
      id: persona.id,
      nombre: persona.nombre,
      rol: persona.rol,
    });
  } catch (error) {
    console.error('Error authenticating:', error);
    return NextResponse.json({ error: 'Error de autenticacion' }, { status: 500 });
  }
}
