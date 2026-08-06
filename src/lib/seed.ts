import { db } from '@/lib/db';

interface Frecuencia {
  routeFrom: string;
  routeTo: string;
  time: string;
}

const VT_DATA: { code: string; busNumber: string; frecuencias: Frecuencia[] }[] = [
  {
    code: 'VT1', busNumber: 'Bus 2',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '06:15' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '08:20' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '10:25' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '12:25' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '15:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '17:30' },
      { routeFrom: 'Loja', routeTo: 'Yangana', time: '20:45' },
      { routeFrom: 'Yangana', routeTo: 'Loja', time: '07:00' },
    ],
  },
  {
    code: 'VT2', busNumber: 'Bus 3',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '09:15' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '11:15' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '13:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '15:40' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '17:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '19:25' },
    ],
  },
  {
    code: 'VT3', busNumber: 'Bus 4',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '05:40' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '07:40' },
      { routeFrom: 'Loja', routeTo: 'La Elvira', time: '12:30' },
      { routeFrom: 'La Elvira', routeTo: 'Loja', time: '17:40' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '20:15' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '06:30' },
    ],
  },
  {
    code: 'VT4', busNumber: 'Bus 5',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '08:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '10:45' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '12:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '14:25' },
      { routeFrom: 'Loja', routeTo: 'La Elvira', time: '16:25' },
      { routeFrom: 'La Elvira', routeTo: 'Loja', time: '08:00' },
    ],
  },
  {
    code: 'VT6', busNumber: 'Bus 7',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '09:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '11:45' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '14:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '16:50' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '18:40' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '20:45' },
    ],
  },
  {
    code: 'VT7', busNumber: 'Bus 8',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '06:25' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '08:50' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '10:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '12:45' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '15:15' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '17:10' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '18:55' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '21:30' },
    ],
  },
  {
    code: 'VT8', busNumber: 'Bus 10',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '06:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '09:00' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '13:40' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '15:30' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '19:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '05:10' },
    ],
  },
  {
    code: 'VT9', busNumber: 'Bus 11',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '07:15' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '09:15' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '11:15' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '13:15' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '16:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '18:30' },
    ],
  },
  {
    code: 'VT10', busNumber: 'Bus 12',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'El Tambo', time: '06:40' },
      { routeFrom: 'El Tambo', routeTo: 'Loja', time: '10:15' },
      { routeFrom: 'Loja', routeTo: 'El Tambo', time: '12:10' },
      { routeFrom: 'El Tambo', routeTo: 'Loja', time: '17:15' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '19:30' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '05:40' },
    ],
  },
  {
    code: 'VT11', busNumber: 'Bus 13',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '07:30' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '10:10' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '13:15' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '14:45' },
      { routeFrom: 'Loja', routeTo: 'El Tambo', time: '17:25' },
      { routeFrom: 'El Tambo', routeTo: 'Loja', time: '06:55' },
    ],
  },
  {
    code: 'VT12', busNumber: 'Bus 14',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '08:30' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '10:30' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '12:20' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '14:15' },
      { routeFrom: 'Loja', routeTo: 'El Tambo', time: '18:20' },
      { routeFrom: 'El Tambo', routeTo: 'Loja', time: '07:50' },
    ],
  },
  {
    code: 'VT13', busNumber: 'Bus 15',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '09:25' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '11:25' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '14:15' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '16:20' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '18:25' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '20:15' },
    ],
  },
  {
    code: 'VT14', busNumber: 'Bus 18',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '05:50' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '08:30' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '11:30' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '13:30' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '17:15' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '18:55' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '21:15' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '06:10' },
    ],
  },
  {
    code: 'VT15', busNumber: 'Bus 1',
    frecuencias: [
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '07:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '09:45' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '11:45' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '13:55' },
      { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '16:15' },
      { routeFrom: 'Vilcabamba', routeTo: 'Loja', time: '18:10' },
    ],
  },
];

// This runs during build to seed initial data if empty
export async function seedIfEmpty() {
  try {
    const count = await db.persona.count();
    if (count === 0) {
      await db.persona.create({
        data: {
          nombre: 'Administrador',
          cedula: null,
          telefono: null,
          rol: 'ADMIN',
          pin: '2107',
          esActual: false,
        },
      });
      console.log('Seed: Admin user created (PIN: 2107)');
    }
  } catch (error) {
    console.error('Seed error:', error);
  }

  // Seed Bus VTs
  try {
    const vtCount = await db.busVT.count();
    if (vtCount === 0) {
      for (let i = 0; i < VT_DATA.length; i++) {
        const vt = VT_DATA[i];
        await db.busVT.create({
          data: {
            code: vt.code,
            busNumber: vt.busNumber,
            frecuencias: vt.frecuencias as any,
            order: i + 1,
          },
        });
      }
      console.log(`Seed: ${VT_DATA.length} BusVTs created`);
    }
  } catch (error) {
    console.error('Seed BusVT error:', error);
  }
}
