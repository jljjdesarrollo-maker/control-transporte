'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type RecordFormData, type TripData, type AppView, createEmptyFormData, num } from './types';

interface RecordFormProps {
  initialData: RecordFormData | null;
  photoPreview: string | null;
  saving: boolean;
  error: string | null;
  onBack: () => void;
  onSave: (data: RecordFormData) => void;
}

export function RecordForm({ initialData, photoPreview, saving, error, onBack, onSave }: RecordFormProps) {
  const [form, setForm] = useState<RecordFormData>(initialData || createEmptyFormData());
  const autoFilled = !!initialData;

  const updateField = (field: keyof RecordFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateTrip = (index: number, field: keyof TripData, value: string) => {
    setForm(prev => {
      const newTrips = [...prev.trips];
      newTrips[index] = { ...newTrips[index], [field]: value };
      return { ...prev, trips: newTrips };
    });
  };

  const addTrip = () => {
    setForm(prev => ({
      ...prev,
      trips: [...prev.trips, { routeFrom: '', routeTo: '', time: '', income: '0', boletoLocal: '0', boletoUrbano: '0', boletoMuni: '0' }],
    }));
  };

  const removeTrip = (index: number) => {
    if (form.trips.length <= 1) return;
    setForm(prev => ({
      ...prev,
      trips: prev.trips.filter((_, i) => i !== index),
    }));
  };

  const totals = useMemo(() => {
    const production = form.trips.reduce((sum, t) => sum + num(t.income), 0);
    const totalGastos = num(form.chofex) + num(form.ayudante) + num(form.diesel) + num(form.planRenova) + num(form.multaTransito) + num(form.otherExpenses);
    const totalIngresos = production + num(form.libres) + num(form.tickets) + num(form.cajaComun);
    const balance = totalIngresos - totalGastos;
    return { production, totalGastos, totalIngresos, balance };
  }, [form]);

  const handleSave = () => {
    const dataToSave = {
      ...form,
      production: String(totals.production),
    };
    onSave(dataToSave);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Registro del Día</h1>
            {autoFilled && (
              <p className="text-xs text-emerald-600 font-medium">Datos extraídos de la foto ✓</p>
            )}
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        <div className="px-4 py-4 space-y-4">
          {/* Photo preview */}
          {photoPreview && (
            <div className="flex justify-center">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-sm">
                <img src={photoPreview} alt="Foto del cuaderno" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                  <ImageIcon className="w-3 h-3 inline" /> Foto adjunta
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Date & KM */}
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
            </CardContent>
          </Card>

          {/* Trips */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Viajes del Día</CardTitle>
                <Button onClick={addTrip} size="sm" variant="outline" className="h-8 rounded-lg text-xs border-dashed">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {form.trips.map((trip, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600">Viaje #{index + 1}</span>
                    {form.trips.length > 1 && (
                      <Button onClick={() => removeTrip(index)} variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-1.5 items-center">
                    <Input
                      placeholder="Origen"
                      value={trip.routeFrom}
                      onChange={(e) => updateTrip(index, 'routeFrom', e.target.value)}
                      className="rounded-lg h-9 text-sm"
                    />
                    <span className="text-gray-400 text-xs px-1">→</span>
                    <Input
                      placeholder="Destino"
                      value={trip.routeTo}
                      onChange={(e) => updateTrip(index, 'routeTo', e.target.value)}
                      className="rounded-lg h-9 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-400">Hora</Label>
                      <Input
                        placeholder="08:30"
                        value={trip.time}
                        onChange={(e) => updateTrip(index, 'time', e.target.value)}
                        className="rounded-lg h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-400">Ingreso</Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={trip.income}
                        onChange={(e) => updateTrip(index, 'income', e.target.value)}
                        className="rounded-lg h-9 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-400">B. Local</Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={trip.boletoLocal}
                        onChange={(e) => updateTrip(index, 'boletoLocal', e.target.value)}
                        className="rounded-lg h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-400">B. Urbano</Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={trip.boletoUrbano}
                        onChange={(e) => updateTrip(index, 'boletoUrbano', e.target.value)}
                        className="rounded-lg h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-400">B. Muni</Label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={trip.boletoMuni}
                        onChange={(e) => updateTrip(index, 'boletoMuni', e.target.value)}
                        className="rounded-lg h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Income Summary */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-semibold text-emerald-700">Ingresos</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Producción (viajes)</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={form.production}
                    onChange={(e) => updateField('production', e.target.value)}
                    className="rounded-xl h-11 font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Libres</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={form.libres}
                    onChange={(e) => updateField('libres', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Tickets</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={form.tickets}
                    onChange={(e) => updateField('tickets', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Caja Común</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={form.cajaComun}
                    onChange={(e) => updateField('cajaComun', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-semibold text-red-600">Gastos</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Chofex</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={form.chofex}
                    onChange={(e) => updateField('chofex', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Ayudante</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={form.ayudante}
                    onChange={(e) => updateField('ayudante', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Diesel</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={form.diesel}
                    onChange={(e) => updateField('diesel', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Plan Renova</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={form.planRenova}
                    onChange={(e) => updateField('planRenova', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Multa Tránsito</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={form.multaTransito}
                    onChange={(e) => updateField('multaTransito', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">Otros Gastos</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    value={form.otherExpenses}
                    onChange={(e) => updateField('otherExpenses', e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">Descripción otros gastos</Label>
                <Input
                  placeholder="Ej: lavado, aceite..."
                  value={form.otherExpDesc}
                  onChange={(e) => updateField('otherExpDesc', e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Live Summary */}
          <Card className="rounded-2xl border-0 shadow-sm bg-gray-900 text-white">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Ingresos</span>
                <span className="font-semibold text-emerald-400">S/ {totals.totalIngresos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Gastos</span>
                <span className="font-semibold text-red-400">S/ {totals.totalGastos.toFixed(2)}</span>
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex justify-between">
                <span className="font-semibold">Balance del Día</span>
                <span className={`text-xl font-bold ${totals.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  S/ {totals.balance.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Save button (bottom) */}
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
    </div>
  );
}
