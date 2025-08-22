"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditarVueloPage() {
  const router = useRouter();
  const params = useParams();
  const codParam = useMemo(() => params?.codvuelo ?? "", [params]);

  const [destinos, setDestinos] = useState([]);
  const [aerolineas, setAerolineas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    codvuelo: "",
    coddestino: "",
    codaerolinea: "",
    salaabordaje: "",
    horasalida: "",
    horallegada: "",
  });

  // Cargar listas + vuelo
  useEffect(() => {
    async function loadData() {
      setError("");
      try {
        const [dRes, aRes, vRes] = await Promise.all([
          fetch("/api/dorado/destinos"),
          fetch("/api/dorado/aerolineas"),
          fetch("/api/dorado/vuelos/consultar"), // se filtra por codvuelo
        ]);
        const [dData, aData, vData] = await Promise.all([
          dRes.json().catch(() => ({})),
          aRes.json().catch(() => ({})),
          vRes.json().catch(() => ({})),
        ]);
        if (!dRes.ok) throw new Error(dData?.message || "Error al cargar destinos");
        if (!aRes.ok) throw new Error(aData?.message || "Error al cargar aerolíneas");

        const vuelos = Array.isArray(vData?.vuelos) ? vData.vuelos : [];
        const vuelo = vuelos.find((v) => (v?.codvuelo || "").toString() === codParam.toString());
        if (!vuelo) throw new Error("Vuelo no encontrado");

        setDestinos(Array.isArray(dData.data) ? dData.data : []);
        setAerolineas(Array.isArray(aData.data) ? aData.data : []);

        const toTime = (value) => {
          try {
            if (!value) return "";
            const d = new Date(value);
            if (isNaN(d.getTime())) return "";
            const hh = String(d.getHours()).padStart(2, "0");
            const mm = String(d.getMinutes()).padStart(2, "0");
            return `${hh}:${mm}`;
          } catch { return ""; }
        };

        setForm({
          codvuelo: vuelo.codvuelo || codParam,
          coddestino: String(vuelo.coddestino ?? ""),
          codaerolinea: String(vuelo.codaerolinea ?? ""),
          salaabordaje: vuelo.salaabordaje || "",
          horasalida: toTime(vuelo.horasalida),
          horallegada: toTime(vuelo.horallegada),
        });
      } catch (e) {
        setError(e.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    if (codParam) loadData();
  }, [codParam]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const todayISO = new Date().toISOString().slice(0, 10);
      const salidaISO = form.horasalida?.length === 5 ? `${todayISO}T${form.horasalida}:00` : form.horasalida;
      const llegadaISO = form.horallegada?.length === 5 ? `${todayISO}T${form.horallegada}:00` : form.horallegada;

      // Validación simple: llegada > salida
      if (salidaISO && llegadaISO && new Date(llegadaISO) <= new Date(salidaISO)) {
        throw new Error("La hora de llegada debe ser posterior a la hora de salida");
      }

      const res = await fetch(`/api/dorado/vuelos/editar/${encodeURIComponent(codParam)}` , {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coddestino: Number(form.coddestino),
          codaerolinea: Number(form.codaerolinea),
          salaabordaje: form.salaabordaje.trim(),
          horasalida: salidaISO,
          horallegada: llegadaISO,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "No se pudo actualizar el vuelo");

      setSuccess("Vuelo actualizado correctamente");
      setTimeout(() => router.push("/gestion-vuelos"), 700);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 p-4 md:p-8">
      <div className="mx-auto max-w-5xl bg-slate-900/60 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h1 className="text-slate-200 text-xl md:text-2xl font-semibold">Panel de Administración</h1>
          <button
            onClick={() => router.push('/gestion-vuelos')}
            className="h-10 px-4 rounded-xl border border-white/15 bg-white/5 text-slate-200 text-sm hover:bg-white/10"
          >
            Volver
          </button>
        </div>

        <div className="px-6 pt-6">
          <h2 className="text-slate-300 text-lg font-medium">Actualizar Vuelo - Formulario de Edición</h2>
        </div>

        <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {error && (
            <div className="md:col-span-3 rounded-xl border border-red-500/35 bg-red-500/10 px-3 py-2 text-rose-200 text-sm">{error}</div>
          )}
          {success && (
            <div className="md:col-span-3 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-emerald-100 text-sm">{success}</div>
          )}

          <div>
            <label className="block text-slate-300 text-sm mb-1">Código de vuelo</label>
            <input
              name="codvuelo"
              value={form.codvuelo}
              disabled
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Aerolínea</label>
            <select
              name="codaerolinea"
              value={form.codaerolinea}
              onChange={onChange}
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={loading}
            >
              <option value="" disabled>Selecciona…</option>
              {aerolineas.map((a) => (
                <option key={a.codaerolinea} value={a.codaerolinea}>{a.descripcion}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Sala de Abordaje</label>
            <input
              name="salaabordaje"
              value={form.salaabordaje}
              onChange={onChange}
              placeholder="Ej: SALA 1"
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Destino</label>
            <select
              name="coddestino"
              value={form.coddestino}
              onChange={onChange}
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={loading}
            >
              <option value="" disabled>Selecciona…</option>
              {destinos.map((d) => (
                <option key={d.coddestino} value={d.coddestino}>{d.descripcion}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Hora de Salida</label>
            <input
              type="time"
              name="horasalida"
              value={form.horasalida}
              onChange={onChange}
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Hora de Llegada</label>
            <input
              type="time"
              name="horallegada"
              value={form.horallegada}
              onChange={onChange}
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-6 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:brightness-110 disabled:opacity-60"
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
