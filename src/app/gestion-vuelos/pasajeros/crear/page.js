"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CrearPasajeroPage() {
  const router = useRouter();
  const [vuelos, setVuelos] = useState([]);
  const [form, setForm] = useState({
    identificacion: "",
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    codvuelo: "",
    foto: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadVuelos() {
      try {
        const res = await fetch("/api/dorado/vuelos/consultar");
        const data = await res.json().catch(() => ({}));
        if (res.status === 404) {
          setVuelos([]);
          setError("");
        } else if (!res.ok) {
          throw new Error(data?.message || "Error al cargar vuelos");
        } else {
          setVuelos(Array.isArray(data?.vuelos) ? data.vuelos : []);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadVuelos();
  }, []);

  
  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return setForm((f) => ({ ...f, foto: "" }));
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result?.toString() || "");
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setForm((f) => ({ ...f, foto: base64 }));
    } catch (_) {}
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // Validaciones básicas
      if (!form.nombres.trim() || !form.apellidos.trim() || !form.email.trim() || !form.telefono || !form.codvuelo) {
        throw new Error("Completa todos los campos requeridos");
      }
      const payload = {
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        email: form.email.trim(),
        telefono: String(form.telefono).replace(/\D/g, ""),
        codvuelo: form.codvuelo,
        foto: form.foto || undefined,
      };

      const res = await fetch("/api/dorado/pasajeros/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "No se pudo registrar el pasajero");

      setSuccess("Pasajero registrado correctamente");
      setTimeout(() => router.push("/gestion-vuelos"), 800);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 p-4 md:p-8">
      <div className="mx-auto max-w-6xl bg-slate-900/60 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
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
          <h2 className="text-slate-300 text-lg font-medium">Crear Pasajero - Formulario de Registro</h2>
        </div>

        <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {error && (
            <div className="md:col-span-3 rounded-xl border border-red-500/35 bg-red-500/10 px-3 py-2 text-rose-200 text-sm">{error}</div>
          )}
          {success && (
            <div className="md:col-span-3 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-emerald-100 text-sm">{success}</div>
          )}

          <div>
            <label className="block text-slate-300 text-sm mb-1">Identificación</label>
            <input
              name="identificacion"
              value={form.identificacion}
              onChange={onChange}
              placeholder="Escribe..."
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Nombres</label>
            <input
              name="nombres"
              value={form.nombres}
              onChange={onChange}
              placeholder="Escribe..."
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Apellidos</label>
            <input
              name="apellidos"
              value={form.apellidos}
              onChange={onChange}
              placeholder="Escribe..."
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Escribe..."
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Teléfono</label>
            <input
              inputMode="numeric"
              name="telefono"
              value={form.telefono}
              onChange={onChange}
              placeholder="Escribe..."
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Vuelo</label>
            <select
              name="codvuelo"
              value={form.codvuelo}
              onChange={onChange}
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={loading}
            >
              <option value="" disabled>Selecciona…</option>
              {vuelos.map((v) => (
                <option key={v.codvuelo} value={v.codvuelo}>
                  {v.codvuelo} — {v.destino?.descripcion || ""}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-300 text-sm mb-1">Foto perfil pasajero (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-slate-100 hover:file:bg-white/20"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-6 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:brightness-110 disabled:opacity-60"
            >
              {saving ? 'Registrando…' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
