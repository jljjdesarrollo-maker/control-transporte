'use client';

import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type SavedRecord } from './types';

interface RecordDetailProps {
  record: SavedRecord;
  onBack: () => void;
}

export function RecordDetail({ record, onBack }: RecordDetailProps) {
  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Liquidacion del Dia</h1>
          <p className="text-xs text-gray-400">{formatDate(record.date)}{record.km ? ` • ${record.km} km` : ''}</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        <div className="px-4 py-4 space-y-4">
          {/* Conductor / Ayudante */}
          {(record.conductor || record.ayudanteNombre) && (
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-4 grid grid-cols-2 gap-3 text-sm">
                {record.conductor && (
                  <div><span className="text-gray-400">Conductor:</span> <span className="font-medium">{record.conductor}</span></div>
                )}
                {record.ayudanteNombre && (
                  <div><span className="text-gray-400">Ayudante:</span> <span className="font-medium">{record.ayudanteNombre}</span></div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Trips */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-semibold">Frecuencias ({record.trips.length})</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {record.trips.map((trip, i) => (
                <div key={trip.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {trip.routeFrom} → {trip.routeTo}
                    </p>
                    <p className="text-xs text-gray-400">{trip.time || 'Sin hora'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">S/ {trip.income.toFixed(2)}</p>
                    {trip.boletos > 0 && (
                      <p className="text-[10px] text-emerald-600">BL: {trip.boletos.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-semibold text-red-600">Gastos</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-1">
              {record.expenses.map((exp) => (
                <div key={exp.id} className="flex justify-between text-sm py-1">
                  <span className="text-gray-500">{exp.description}</span>
                  <span className="font-medium">S/ {exp.amount.toFixed(2)}</span>
                </div>
              ))}
              <Separator className="my-1" />
              <div className="flex justify-between text-sm font-bold text-red-600">
                <span>Total Gastos</span>
                <span>S/ {record.totalGastos.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="rounded-2xl border-0 shadow-sm bg-gray-900 text-white">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Produccion</span>
                <span className="font-semibold">S/ {record.production.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Caja Comun</span>
                <span className="font-semibold">S/ {record.cajaComun.toFixed(2)}</span>
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Gastos</span>
                <span className="font-semibold text-red-400">S/ {record.totalGastos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tickets</span>
                <span className="font-semibold">S/ {record.tickets.toFixed(2)}</span>
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Entrega Ayudante</span>
                <span className={`font-bold ${record.entregaAyudante >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  S/ {record.entregaAyudante.toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-gray-500">Produccion - Total Gastos</p>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Entrega Compania</span>
                <span className={`font-bold ${record.entregaCompania >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  S/ {record.entregaCompania.toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-gray-500">Caja Comun - Tickets</p>
            </CardContent>
          </Card>

          {/* Photo */}
          {record.photoUrl && (
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FileText className="w-4 h-4" /> Foto del cuaderno
                </p>
                <img src={record.photoUrl} alt="Foto" className="w-full rounded-xl" />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
