'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, ChevronRight, Calendar, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type SavedRecord } from './types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface HistoryScreenProps {
  onBack: () => void;
  onViewRecord: (record: SavedRecord) => void;
}

export function HistoryScreen({ onBack, onViewRecord }: HistoryScreenProps) {
  const [records, setRecords] = useState<SavedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/records');
      const data = await res.json();
      setRecords(data);
    } catch {
      console.error('Error loading records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/records/${deleteTarget}`, { method: 'DELETE' });
      setRecords(prev => prev.filter(r => r.id !== deleteTarget));
    } catch {
      console.error('Error deleting record');
    }
    setDeleteTarget(null);
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-white">
        <header className="flex items-center gap-3 p-4 border-b border-gray-100">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Historial</h1>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">Historial</h1>
        <span className="ml-auto text-sm text-gray-400">{records.length} registros</span>
      </header>

      <main className="flex-1 overflow-y-auto pb-6">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <Calendar className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Sin registros aún</p>
            <p className="text-sm text-gray-400 mt-1">Tu historial aparecerá aquí</p>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-3">
            {records.map(record => (
              <Card
                key={record.id}
                className="rounded-2xl border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onViewRecord(record)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">{formatDate(record.date)}</span>
                        {record.km && (
                          <span className="text-xs text-gray-400">• {record.km} km</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-gray-600">S/ {record.production.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                          <span className="text-gray-600">S/ {record.totalGastos.toFixed(2)}</span>
                        </div>
                        <span className={`font-bold ${record.entregaAyudante >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {record.entregaAyudante >= 0 ? '+' : ''}{record.entregaAyudante.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {record.trips.length} frec. {record.conductor ? `• ${record.conductor}` : ''}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(record.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El registro se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
