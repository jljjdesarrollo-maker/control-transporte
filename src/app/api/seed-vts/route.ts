import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { VT_DATA } from '@/lib/seed-vts';

const prisma = new PrismaClient();

// POST - seed VTs (only creates if not existing)
export async function POST() {
  try {
    let created = 0;
    let skipped = 0;

    for (const vt of VT_DATA) {
      const existing = await prisma.busVT.findUnique({
        where: { codigo: vt.codigo },
      });

      if (existing) {
        skipped++;
      } else {
        await prisma.busVT.create({
          data: {
            codigo: vt.codigo,
            nombre: vt.nombre,
            frecuencias: vt.frecuencias as any,
            activo: true,
          },
        });
        created++;
      }
    }

    return NextResponse.json({
      message: `Seed completado: ${created} creados, ${skipped} ya existian`,
      created,
      skipped,
      total: VT_DATA.length,
    });
  } catch (error) {
    console.error('Error seeding VTs:', error);
    return NextResponse.json({ error: 'Error al ejecutar seed' }, { status: 500 });
  }
}
