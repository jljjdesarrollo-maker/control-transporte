'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, Bus, ChevronDown, ChevronUp, Pencil, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Frecuencia {
  routeFrom: string;
  routeTo: string;
  time: string;
}

interface BusVT {
  id: string;
  code: string;
  busNumber: string;
  frecuencias: Frecuencia[];
  order: number;
}

interface ConfigScreenProps {
  onBack: () => void;
}

export function ConfigScreen({ onBack }: ConfigScreenProps) {
  const [vts, setVts] = useState<BusVT[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editFreqs, setEditFreqs] = useState<Frecuencia[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/bus-vts')
      .then(r => r.json())
      .then((data: BusVT[]) => {
        setVts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleExpand = (code: string) => {
    if (expanded === code) {
      setExpanded(null);
      setEditFreqs(null);
    } else {
      const vt = vts.find(v => v.code === code);
      setExpanded(code);
      setEditFreqs(vt ? JSON.parse(JSON.stringify(vt.frecuencias)) : []);
    }
  };

  const updateFreq = (index: number, field: keyof Frecuencia, value: string) => {
    setEditFreqs(prev => {
      if (!prev) return prev;
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addFreq = () => {
    setEditFreqs(prev => [...(prev || []), { routeFrom: 'Loja', routeTo: 'Vilcabamba', time: '' }]);
  };

  const removeFreq = (index: number) => {
    setEditFreqs(prev => (prev || []).filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!expanded || !editFreqs) return;
    setSaving(true);
    try {
      const res = await fetch('/api/bus-vts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: expanded, frecuencias: editFreqs }),
      });
      if (!res.ok) throw new Error('Error al guardar');

      const updated = await res.json();
      setVts(prev => prev.map(v => v.code === expanded ? { ...v, frecuencias: updated.frecuencias } : v));
      setEditFreqs(updated.frecuencias);
      toast({ title: 'VT actualizada', description: `Frecuencias de ${expanded} guardadas.` });
    } catch {
      toast({ title: 'Error', description: 'No se pudo guardar.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#FAFAFA]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#D6D6D6] px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl text-[#3A3A3A]">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-[#3A3A3A]">Configuracion VT</h1>
          <p className="text-xs text-[#3A3A3A]/50">Frecuencias por unidad</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-6 px-4 pt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#912D26] animate-spin" />
          </div>
        ) : (
          vts.map(vt => (
            <Card key={vt.code} className="rounded-2xl border border-[#D6D6D6] bg-white overflow-hidden">
              {/* VT Header */}
              <button
                onClick={() => handleExpand(vt.code)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#912D26]/10 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-[#912D26]" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#3A3A3A]">{vt.code} - {vt.busNumber}</p>
                    <p className="text-xs text-[#3A3A3A]/50">{vt.frecuencias.length} frecuencias</p>
                  </div>
                </div>
                {expanded === vt.code
                  ? <ChevronUp className="w-5 h-5 text-[#3A3A3A]/40" />
                  : <ChevronDown className="w-5 h-5 text-[#3A3A3A]/40" />
                }
              </button>

              {/* Expanded: Frequencies */}
              {expanded === vt.code && editFreqs && (
                <div className="border-t border-[#D6D6D6] p-4 space-y-3">
                  {editFreqs.map((freq, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#3A3A3A]/40 w-8">F{i + 1}</span>
                      <Input
                        value={freq.routeFrom}
                        onChange={e => updateFreq(i, 'routeFrom', e.target.value)}
                        className="h-9 text-xs rounded-lg flex-1 border-[#D6D6D6]"
                        placeholder="Origen"
                      />
                      <span className="text-[#3A3A3A]/30">→</span>
                      <Input
                        value={freq.routeTo}
                        onChange={e => updateFreq(i, 'routeTo', e.target.value)}
                        className="h-9 text-xs rounded-lg flex-1 border-[#D6D6D6]"
                        placeholder="Destino"
                      />
                      <Input
                        value={freq.time}
                        onChange={e => updateFreq(i, 'time', e.target.value)}
                        className="h-9 text-xs rounded-lg w-16 border-[#D6D6D6] text-center"
                        placeholder="HH:MM"
                      />
                      <Button onClick={() => removeFreq(i)} variant="ghost" size="icon" className="h-8 w-8 text-[#3A3A3A]/30 hover:text-red-500 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}

                  <Button onClick={addFreq} variant="outline" size="sm" className="w-full h-9 rounded-xl border-dashed border-[#D6D6D6] text-xs text-[#3A3A3A]/60">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Agregar Frecuencia
                  </Button>

                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full h-11 rounded-xl bg-[#912D26] hover:bg-[#7A2520] text-white text-sm font-semibold"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                    {saving ? 'Guardando...' : `Guardar ${vt.code}`}
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
