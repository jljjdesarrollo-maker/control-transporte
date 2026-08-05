'use client';

import { useState, useEffect, useCallback } from 'react';
import { HomeScreen } from '@/components/transport/HomeScreen';
import { RecordForm } from '@/components/transport/RecordForm';
import { HistoryScreen } from '@/components/transport/HistoryScreen';
import { RecordDetail } from '@/components/transport/RecordDetail';
import { type AppView, type RecordFormData, type SavedRecord, num } from '@/components/transport/types';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [view, setView] = useState<AppView>('home');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordCount, setRecordCount] = useState(0);
  const [detailRecord, setDetailRecord] = useState<SavedRecord | null>(null);
  const { toast } = useToast();

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/records');
      const data = await res.json();
      setRecordCount(Array.isArray(data) ? data.length : 0);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchCount(); }, [fetchCount]);

  const handleSave = async (data: RecordFormData, photoBase64: string | null) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: data.date,
          km: data.km,
          conductor: data.conductor,
          ayudanteNombre: data.ayudanteNombre,
          tickets: num(data.tickets),
          trips: data.trips.map(t => ({
            routeFrom: t.routeFrom,
            routeTo: t.routeTo,
            time: t.time || null,
            income: num(t.income),
            boletos: num(t.boletos),
          })),
          expenses: data.expenses.map(e => ({
            description: e.description,
            amount: num(e.amount),
          })),
          photoUrl: photoBase64,
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Error al guardar');
      }

      toast({ title: 'Registro guardado', description: 'Liquidacion registrada correctamente.' });
      fetchCount();
      setView('home');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar';
      setError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (detailRecord) {
    return <RecordDetail record={detailRecord} onBack={() => setDetailRecord(null)} />;
  }

  switch (view) {
    case 'form':
      return (
        <RecordForm
          saving={saving}
          error={error}
          onBack={() => { setView('home'); setError(null); }}
          onSave={handleSave}
        />
      );
    case 'history':
      return (
        <HistoryScreen
          onBack={() => setView('home')}
          onViewRecord={(record) => setDetailRecord(record)}
        />
      );
    default:
      return (
        <HomeScreen
          onGoToForm={() => setView('form')}
          onGoToHistory={() => setView('history')}
          onGoToReports={() => {}}
          recordCount={recordCount}
        />
      );
  }
}
