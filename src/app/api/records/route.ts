import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { type Prisma } from '@prisma/client';

export async function GET() {
  try {
    const records = await db.dailyRecord.findMany({
      orderBy: { date: 'desc' },
      include: { trips: { orderBy: { order: 'asc' } } },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    return NextResponse.json({ error: 'Error al obtener registros' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, km, production, libres, tickets, cajaComun, chofex, ayudante, diesel, planRenova, multaTransito, otherExpenses, otherExpDesc, totalGastos, totalIngresos, balance, trips, photoUrl } = body;

    const totalGastosCalc = (Number(chofex) || 0) + (Number(ayudante) || 0) + (Number(diesel) || 0) + (Number(planRenova) || 0) + (Number(multaTransito) || 0) + (Number(otherExpenses) || 0);
    const totalIngresosCalc = Number(production) || 0;
    const balanceCalc = totalIngresosCalc + (Number(libres) || 0) + (Number(tickets) || 0) + (Number(cajaComun) || 0) - totalGastosCalc;

    const record = await db.dailyRecord.create({
      data: {
        date: date || new Date().toISOString().split('T')[0],
        km: km || null,
        production: Number(production) || 0,
        libres: Number(libres) || 0,
        tickets: Number(tickets) || 0,
        cajaComun: Number(cajaComun) || 0,
        chofex: Number(chofex) || 0,
        ayudante: Number(ayudante) || 0,
        diesel: Number(diesel) || 0,
        planRenova: Number(planRenova) || 0,
        multaTransito: Number(multaTransito) || 0,
        otherExpenses: Number(otherExpenses) || 0,
        otherExpDesc: otherExpDesc || null,
        totalGastos: totalGastosCalc,
        totalIngresos: totalIngresosCalc,
        balance: balanceCalc,
        photoUrl: photoUrl || null,
        trips: {
          create: (trips || []).map((t: { routeFrom: string; routeTo: string; time?: string; income?: number; boletoLocal?: number; boletoUrbano?: number; boletoMuni?: number }, i: number) => ({
            order: i + 1,
            routeFrom: t.routeFrom || '',
            routeTo: t.routeTo || '',
            time: t.time || null,
            income: Number(t.income) || 0,
            boletoLocal: Number(t.boletoLocal) || 0,
            boletoUrbano: Number(t.boletoUrbano) || 0,
            boletoMuni: Number(t.boletoMuni) || 0,
          })),
        },
      },
      include: { trips: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json({ error: 'Error al crear registro' }, { status: 500 });
  }
}
