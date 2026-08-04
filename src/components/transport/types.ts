export interface TripData {
  routeFrom: string;
  routeTo: string;
  time: string;
  income: string;
  boletoLocal: string;
  boletoUrbano: string;
  boletoMuni: string;
}

export interface RecordFormData {
  date: string;
  km: string;
  production: string;
  libres: string;
  tickets: string;
  cajaComun: string;
  chofex: string;
  ayudante: string;
  diesel: string;
  planRenova: string;
  multaTransito: string;
  otherExpenses: string;
  otherExpDesc: string;
  trips: TripData[];
}

export interface SavedRecord {
  id: string;
  date: string;
  km: string | null;
  production: number;
  libres: number;
  tickets: number;
  cajaComun: number;
  chofex: number;
  ayudante: number;
  diesel: number;
  planRenova: number;
  multaTransito: number;
  otherExpenses: number;
  otherExpDesc: string | null;
  totalGastos: number;
  totalIngresos: number;
  balance: number;
  createdAt: string;
  trips: {
    id: string;
    order: number;
    routeFrom: string;
    routeTo: string;
    time: string | null;
    income: number;
    boletoLocal: number;
    boletoUrbano: number;
    boletoMuni: number;
  }[];
}

export type AppView = 'home' | 'capture' | 'form' | 'history';

export function createEmptyFormData(): RecordFormData {
  return {
    date: new Date().toISOString().split('T')[0],
    km: '',
    production: '0',
    libres: '0',
    tickets: '0',
    cajaComun: '0',
    chofex: '0',
    ayudante: '0',
    diesel: '0',
    planRenova: '0',
    multaTransito: '0',
    otherExpenses: '0',
    otherExpDesc: '',
    trips: [
      { routeFrom: '', routeTo: '', time: '', income: '0', boletoLocal: '0', boletoUrbano: '0', boletoMuni: '0' },
    ],
  };
}

export function num(v: string): number {
  return parseFloat(v) || 0;
}
