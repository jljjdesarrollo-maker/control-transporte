'use client';

import { History, Pencil, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HomeScreenProps {
  onGoToForm: () => void;
  onGoToHistory: () => void;
  onGoToReports: () => void;
  recordCount: number;
}

export function HomeScreen({ onGoToForm, onGoToHistory, onGoToReports, recordCount }: HomeScreenProps) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 mb-4">
          <Truck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Control de Transporte</h1>
        <p className="text-gray-500 mt-1 text-sm">Registra tus gastos e ingresos diarios</p>
      </header>

      {/* Main Actions */}
      <main className="flex-1 px-5 pb-6 flex flex-col gap-4">
        {/* Primary: Manual */}
        <Button
          onClick={onGoToForm}
          className="w-full h-20 text-lg font-semibold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 active:scale-[0.98] transition-transform"
        >
          <Pencil className="w-6 h-6 mr-3" />
          Nuevo Registro
        </Button>

        {/* History Card */}
        <Card
          onClick={onGoToHistory}
          className="mt-2 cursor-pointer hover:shadow-md transition-shadow rounded-2xl border-0 bg-white shadow-sm"
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <History className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Historial</p>
                <p className="text-xs text-gray-500">Ver registros anteriores</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-emerald-600">{recordCount}</span>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400">
        Transporte Control v1.0
      </footer>
    </div>
  );
}
