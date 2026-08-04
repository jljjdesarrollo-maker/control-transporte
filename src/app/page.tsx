'use client';

import { useState, useEffect, useCallback } from 'react';
import { HomeScreen } from '@/components/transport/HomeScreen';
import { CaptureScreen } from '@/components/transport/CaptureScreen';
import { RecordForm } from '@/components/transport/RecordForm';
import { HistoryScreen } from '@/components/transport/HistoryScreen';
import { RecordDetail } from '@/components/transport/RecordDetail';
import { type AppView, type RecordFormData, type SavedRecord, createEmptyFormData, num } from '@/components/transport/types';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [view, setView] = useState<AppView>('home');
  const [formData, setFormData] = useState<RecordFormData | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
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
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  const handlePhotoCaptured = async (base64: string) => {
    setPhotoPreview(base64);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Error al procesar la imagen');
      }

      const data = result.data;
      const mappedTrips = (data.trips || []).map((t: { routeFrom: string; routeTo: string; time?: string; income?: number; boletoLocal?: number; boletoUrbano?: number; boletoMuni?: number }) => ({
        routeFrom: t.routeFrom || '',
        routeTo: t.routeTo || '',
        time: t.time || '',
        income: String(t.income || 0),
        boletoLocal: String(t.boletoLocal || 0),
        boletoUrbano: String(t.boletoUrbano || 0),
        boletoMuni: String(t.boletoMuni || 0),
      }));

      if (mappedTrips.length === 0) {
        mappedTrips.push({ routeFrom: '', routeTo: '', time: '', income: '0', boletoLocal: '0', boletoUrbano: '0', boletoMuni: '0' });
      }

      const gastos = data.gastos || {};
      const filled: RecordFormData = {
        date: data.date || new Date().toISOString().split('T')[0],
        km: data.km || '',
        production: String(data.production || 0),
        libres: String(data.libres || 0),
        tickets: String(data.tickets || 0),
        cajaComun: String(data.cajaComun || 0),
        chofex: String(gastos.chofex || 0),
        ayudante: String(gastos.ayudante || 0),
        diesel: String(gastos.diesel || 0),
        planRenova: String(gastos.planRenova || 0),
        multaTransito: String(gastos.multaTransito || 0),
        otherExpenses: String(gastos.otherExpenses || 0),
        otherExpDesc: gastos.otherExpDesc || '',
        trips: mappedTrips,
      };

      setFormData(filled);
      setView('form');
      toast({ title: 'Datos extraídos', description: 'Revisa y corrige los datos antes de guardar.', variant: 'default' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      setFormData(null);
      setView('form');
    }
  };

  const handleSkipPhoto = () => {
    setPhotoPreview(null);
    setFormData(null);
    setError(null);
    setView('form');
  };

  const handleGoToManual = () => {
    setPhotoPreview(null);
    setFormData(null);
    setError(null);
    setView('form');
  };

  const handleSave = async (data: RecordFormData) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: data.date,
          km: data.km,
          production: num(data.production),
          libres: num(data.libres),
          tickets: num(data.tickets),
          cajaComun: num(data.cajaComun),
          chofex: num(data.chofex),
          ayudante: num(data.ayudante),
          diesel: num(data.diesel),
          planRenova: num(data.planRenova),
          multaTransito: num(data.multaTransito),
          otherExpenses: num(data.otherExpenses),
          otherExpDesc: data.otherExpDesc,
          trips: data.trips.map(t => ({
            routeFrom: t.routeFrom,
            routeTo: t.routeTo,
            time: t.time || null,
            income: num(t.income),
            boletoLocal: num(t.boletoLocal),
            boletoUrbano: num(t.boletoUrbano),
            boletoMuni: num(t.boletoMuni),
          })),
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Error al guardar');
      }

      toast({ title: 'Registro guardado', description: 'Se guardó correctamente.', variant: 'default' });
      fetchCount();
      setView('home');
      setFormData(null);
      setPhotoPreview(null);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar el registro';
      setError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (detailRecord) {
    return (
      <RecordDetail
        record={detailRecord}
        onBack={() => {
          setDetailRecord(null);
        }}
      />
    );
  }

  switch (view) {
    case 'capture':
      return (
        <CaptureScreen
          onBack={() => setView('home')}
          onPhotoCaptured={handlePhotoCaptured}
          onSkipPhoto={handleSkipPhoto}
        />
      );
    case 'form':
      return (
        <RecordForm
          initialData={formData}
          photoPreview={photoPreview}
          saving={saving}
          error={error}
          onBack={() => {
            setView('home');
            setFormData(null);
            setPhotoPreview(null);
            setError(null);
          }}
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
          onGoToCapture={() => setView('capture')}
          onGoToManual={handleGoToManual}
          onGoToHistory={() => setView('history')}
          recordCount={recordCount}
        />
      );
  }
}
