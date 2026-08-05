export interface TripData {
  routeFrom: string;
  routeTo: string;
  time: string;
  income: string;
  boletos: string;
}

export interface ExpenseData {
  description: string;
  amount: string;
}

export interface RecordFormData {
  date: string;
  km: string;
  conductor: string;
  ayudanteNombre: string;
  trips: TripData[];
  expenses: ExpenseData[];
  tickets: string;
}

export interface SavedRecord {
  id: string;
  date: string;
  km: string | null;
  conductor: string | null;
  ayudanteNombre: string | null;
  production: number;
  cajaComun: number;
  tickets: number;
  entregaAyudante: number;
  entregaCompania: number;
  totalGastos: number;
  photoUrl: string | null;
  createdAt: string;
  trips: {
    id: string;
    order: number;
    routeFrom: string;
    routeTo: string;
    time: string | null;
    income: number;
    boletos: number;
  }[];
  expenses: {
    id: string;
    order: number;
    description: string;
    amount: number;
  }[];
}

export type AppView = 'home' | 'form' | 'history' | 'reports';

export function num(v: string): number {
  return parseFloat(v) || 0;
}

export function createEmptyFormData(): RecordFormData {
  return {
    date: new Date().toISOString().split('T')[0],
    km: '',
    conductor: 'Jymmi Vera',
    ayudanteNombre: 'Jorge Cabrera',
    trips: [],
    expenses: [
      { description: 'Chofer', amount: '0' },
      { description: 'Ayudante', amount: '0' },
      { description: 'Diesel', amount: '0' },
      { description: 'Plan Renova', amount: '0' },
    ],
    tickets: '0',
  };
}
