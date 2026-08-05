'use client';

import { useState, useMemo, useRef } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Camera, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type RecordFormData, type TripData, type ExpenseData, createEmptyFormData, num } from './types';
import { routes, getRouteLabel, getTimesForRoute } from '@/lib/routes';

interface RecordFormProps {
  saving: boolean;
  error: string | null;
  onBack: () => void;
  onSave: (data: RecordFormData, photoBase64: string | null) => void;
}

export function RecordForm({ saving, error, onBack, onSave }: RecordFormProps) {
  const [form, setForm] = useState<RecordFormData>(createEmptyFormData());
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof RecordFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addTrip = () => {
    setForm((prev) => ({
      ...prev,
      trips: [...prev.trips, { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '', income: '0', boletos: '0' }],
    }));
  };

  const removeTrip = (index: number) => {
    setForm((prev) => ({
      ...prev,
      trips: prev.trips.filter((_, i) => i !== index),
    }));
  };

  const updateTrip = (index: number, field: keyof TripData, value: string) => {
    setForm((prev) => {
      const newTrips = [...prev.trips];
      newTrips[index] = { ...newTrips[index], [field]: value };
      return { ...prev, trips: newTrips };
    });
  };

  const handleRouteSelect = (index: number, routeLabel: string) => {
    const route = routes.find((r) => getRouteLabel(r.from, r.to) === routeLabel);
    if (route) {
      setForm((prev) => {
        const newTrips = [...prev.trips];
        newTrips[index] = { ...newTrips[index], routeFrom: route.from, routeTo: route.to, time: '' };
        return { ...prev, trips: newTrips };
      });
    }
  };

  const addExpense = () => {
    setForm((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { description: '', amount: '0' }],
    }));
  };

  const removeExpense = (index: number) => {
    setForm((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((_, i) => i !== index),
    }));
  };

  const updateExpense = (index: number, field: keyof ExpenseData, value: string) => {
    setForm((prev) => {
      const newExp = [...prev.expenses];
      newExp[index] = { ...newExp[index], [field]: value };
      return { ...prev, expenses: newExp };
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const totals = useMemo(() => {
    const production = form.trips.reduce((s, t) => s + num(t.income), 0);
    const cajaComun = form.trips.reduce((s, t) => s + num(t.boletos), 0);
    const totalGastos = form.expenses.reduce((s, e) => s + num(e.amount), 0);
    const tickets = num(form.tickets);
    const entregaAyudante = production - totalGastos;
    const entregaCompania = cajaComun - tickets;
    return { production, cajaComun, totalGastos, tickets, entregaAyudante, entregaCompania };
  }, [form]);

  const handleSave = () => {
    onSave(form, photoPreview);
  };

  const allRouteOptions = routes.map((r) => getRouteLabel(r.from, r.to));

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Registro del Dia</h1>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        <div className="px-4 py-4 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* 1. Cabecera */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Fecha</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Kilometraje</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="877604"
                    value={form.km}
                    onChange={(e) => updateField('km', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Conductor</Label>
                  <Input
                    placeholder="Nombre del conductor"
                    value={form.conductor}
                    onChange={(e) => updateField('conductor', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Ayudante</Label>
                  <Input
                    placeholder="Nombre del ayudante"
                    value={form.ayudanteNombre}
                    onChange={(e) => updateField('ayudanteNombre', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              {/* Foto opcional */}
              <div>
                <Label className="text-xs font-medium text-gray-500">Foto del Cuaderno (Opcional)</Label>
                <div className="mt-1.5">
                  {photoPreview ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-200">
                      <img src={photoPreview} alt="Foto" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPhotoPreview(null)}
                        className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-bl-lg flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 px-4 rounded-xl text-xs"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      Tomar/Adjuntar Foto
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Frecuencias */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Frecuencias del Dia</CardTitle>
                <Button onClick={addTrip} size="sm" variant="outline" className="h-8 rounded-lg text-xs border-dashed">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {form.trips.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm">
                  <p>Toca &quot;Agregar&quot; para registrar frecuencias</p>
                </div>
              )}
              {form.trips.map((trip, index) => {
                const tripTimes = getTimesForRoute(trip.routeFrom, trip.routeTo);
                return (
                  <div key={index} className="bg-gray-50 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600">Frecuencia #{index + 1}</span>
                      <Button onClick={() => removeTrip(index)} variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-400">Ruta</Label>
                      <select
                        value={getRouteLabel(trip.routeFrom, trip.routeTo)}
                        onChange={(e) => handleRouteSelect(index, e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm"
                      >
                        {allRouteOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-400">Hora de Salida</Label>
                      {tripTimes.length > 0 ? (
                        <select
                          value={trip.time}
                          onChange={(e) => updateTrip(index, 'time', e.target.value)}
                          className="w-full h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm"
                        >
                          <option value="">-- Seleccionar --</option>
                          {tripTimes.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          placeholder="HH:MM"
                          value={trip.time}
                          onChange={(e) => updateTrip(index, 'time', e.target.value)}
                          className="h-9 text-sm rounded-lg"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-400">Ingreso (Produccion)</Label>
                        <Input
                          type="number"
                          inputMode="decimal"
                          value={trip.income}
                          onChange={(e) => updateTrip(index, 'income', e.target.value)}
                          className="h-9 text-sm rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-400">Boletos (Caja Comun)</Label>
                        <Input
                          type="number"
                          inputMode="decimal"
                          value={trip.boletos}
                          onChange={(e) => updateTrip(index, 'boletos', e.target.value)}
                          className="h-9 text-sm rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* 3. Gastos */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-red-600">Gastos</CardTitle>
                <Button onClick={addExpense} size="sm" variant="outline" className="h-8 rounded-lg text-xs border-dashed">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {form.expenses.map((exp, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Descripcion"
                    value={exp.description}
                    onChange={(e) => updateExpense(index, 'description', e.target.value)}
                    className="h-10 text-sm rounded-lg flex-1"
                  />
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={exp.amount}
                    onChange={(e) => updateExpense(index, 'amount', e.target.value)}
                    className="h-10 text-sm rounded-lg w-24"
                  />
                  {index >= 4 && (
                    <Button onClick={() => removeExpense(index)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="pt-2 flex justify-between text-sm font-semibold text-red-600">
                <span>Total Gastos</span>
                <span>S/ {totals.totalGastos.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* 4. Tickets */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="p-4">
              <Label className="text-xs font-medium text-gray-500 mb-2 block">Tickets</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateField('tickets', '4.50')}
                  className={`h-11 rounded-xl text-sm font-semibold border-2 transition-colors ${form.tickets === '4.50' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300'}`}
                >
                  $4.50
                </button>
                <button
                  type="button"
                  onClick={() => updateField('tickets', '6.00')}
                  className={`h-11 rounded-xl text-sm font-semibold border-2 transition-colors ${form.tickets === '6.00' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300'}`}
                >
                  $6.00
                </button>
                <button
                  type="button"
                  onClick={() => updateField('tickets', '')}
                  className={`h-11 rounded-xl text-sm font-semibold border-2 transition-colors ${form.tickets === '' ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-red-300'}`}
                >
                  Ninguno
                </button>
              </div>
            </CardContent>
          </Card>

          {/* 5. Resumen */}
          <Card className="rounded-2xl border-0 shadow-sm bg-gray-900 text-white">
            <CardContent className="p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Liquidacion del Dia</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Produccion</span>
                <span className="font-semibold">S/ {totals.production.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Caja Comun (Boletos)</span>
                <span className="font-semibold">S/ {totals.cajaComun.toFixed(2)}</span>
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Gastos</span>
                <span className="font-semibold text-red-400">S/ {totals.totalGastos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tickets</span>
                <span className="font-semibold">S/ {totals.tickets.toFixed(2)}</span>
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Entrega Ayudante</span>
                <span className={`font-bold ${totals.entregaAyudante >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  S/ {totals.entregaAyudante.toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-gray-500">Produccion - Total Gastos</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Entrega Compania</span>
                <span className={`font-bold ${totals.entregaCompania >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  S/ {totals.entregaCompania.toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-gray-500">Caja Comun - Tickets</p>
            </CardContent>
          </Card>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-14 text-base font-semibold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            {saving ? 'Guardando...' : 'Guardar Registro'}
          </Button>
        </div>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoChange}
      />
    </div>
  );
}
