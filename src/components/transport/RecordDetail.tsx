'use client';

import { ArrowLeft } from 'lucide-react';
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
          <h1 className="text-lg font-semibold text-gray-900">Detalle del Registro</h1>
          <p className="text-xs text-gray-400">{formatDate(record.date)}{record.km ? ` • ${record.km} km` : ''}</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        <div className="px-4 py-4 space-y-4">
          {/* Trips */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-semibold">Viajes ({record.trips.length})</CardTitle>
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
                    <p className="text-xs text-gray-400">
                      {trip.time || 'Sin hora'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900">S/ {trip.income.toFixed(2)}</p>
                    {(trip.boletoLocal > 0 || trip.boletoUrbano > 0 || trip.boletoMuni > 0) && (
                      <p className="text-[10px] text-gray-400">
                        BL:{trip.boletoLocal.toFixed(0)} BU:{trip.boletoUrbano.toFixed(0)} BM:{trip.boletoMuni.toFixed(0)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Income */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-semibold text-emerald-700">Ingresos</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Producción</span>
                <span className="font-medium">S/ {record.production.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Libres</span>
                <span className="font-medium">S/ {record.libres.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tickets</span>
                <span className="font-medium">S/ {record.tickets.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Caja Común</span>
                <span className="font-medium">S/ {record.cajaComun.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-semibold text-red-600">Gastos</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {record.chofex > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Chofex</span>
                  <span className="font-medium">S/ {record.chofex.toFixed(2)}</span>
                </div>
              )}
              {record.ayudante > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ayudante</span>
                  <span className="font-medium">S/ {record.ayudante.toFixed(2)}</span>
                </div>
              )}
              {record.diesel > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Diesel</span>
                  <span className="font-medium">S/ {record.diesel.toFixed(2)}</span>
                </div>
              )}
              {record.planRenova > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Plan Renova</span>
                  <span className="font-medium">S/ {record.planRenova.toFixed(2)}</span>
                </div>
              )}
              {record.multaTransito > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Multa Tránsito</span>
                  <span className="font-medium">S/ {record.multaTransito.toFixed(2)}</span>
                </div>
              )}
              {record.otherExpenses > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Otros ({record.otherExpDesc || '-'})</span>
                  <span className="font-medium">S/ {record.otherExpenses.toFixed(2)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="rounded-2xl border-0 shadow-sm bg-gray-900 text-white">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Ingresos</span>
                <span className="font-semibold text-emerald-400">S/ {record.totalIngresos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Gastos</span>
                <span className="font-semibold text-red-400">S/ {record.totalGastos.toFixed(2)}</span>
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex justify-between">
                <span className="font-semibold">Balance</span>
                <span className={`text-xl font-bold ${record.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  S/ {record.balance.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
