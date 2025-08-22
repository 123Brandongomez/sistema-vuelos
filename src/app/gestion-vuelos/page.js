"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GestionVuelosPage() {
  const router = useRouter();
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seeding, setSeeding] = useState(false);

  async function fetchVuelos() {
    try {
      const res = await fetch("/api/dorado/vuelos/consultar");
      const data = await res.json();
      if (res.status === 404) {
        setVuelos([]);
        setError("");
        return;
      }
      if (!res.ok) throw new Error(data?.message || "Error al consultar vuelos");
      setVuelos(Array.isArray(data.vuelos) ? data.vuelos : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVuelos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        await fetch("/api/dorado/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      }
    } catch (_) {}
    finally {
      if (typeof window !== "undefined") localStorage.removeItem("token");
      router.push("/login");
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await fetch("/api/dorado/vuelos/seed", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "No se pudo generar datos de ejemplo");
      }
      await fetchVuelos();
    } catch (e) {
      setError(e.message);
    } finally {
      setSeeding(false);
    }
  }

  function fmtHora(value) {
    if (!value) return "-";
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "-";
    }
  }

  function fmtDuracion(salida, llegada) {
    try {
      const a = new Date(salida).getTime();
      const b = new Date(llegada).getTime();
      if (isNaN(a) || isNaN(b)) return "-";
      const diffMs = Math.max(0, b - a);
      const totalMin = Math.floor(diffMs / 60000);
      const h = String(Math.floor(totalMin / 60)).padStart(2, "0");
      const m = String(totalMin % 60).padStart(2, "0");
      return `${h}:${m}`;
    } catch {
      return "-";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 p-4 md:p-8">
      <div className="mx-auto max-w-6xl bg-slate-900/60 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h1 className="text-slate-200 text-xl md:text-2xl font-semibold">Panel de Administración</h1>
          <button
            onClick={handleLogout}
            className="h-10 px-4 rounded-xl border border-white/15 bg-white/5 text-slate-200 text-sm hover:bg-white/10 active:translate-y-px"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between px-6 py-4">
          <h2 className="text-slate-300 text-lg font-medium">Gestión de Vuelos</h2>
          <div className="flex gap-3">
            <button onClick={() => router.push('/gestion-vuelos/pasajeros/crear')} className="h-10 px-4 rounded-xl bg-teal-500 text-white text-sm font-medium hover:brightness-105">Crear Pasajero +</button>
            <button onClick={() => router.push('/gestion-vuelos/crear')} className="h-10 px-4 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:brightness-105">Crea Vuelo +</button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-slate-400 text-sm">Cargando vuelos…</div>
          ) : error ? (
            <div className="text-rose-300 text-sm">{error}</div>
          ) : (
            <div className="overflow-auto rounded-xl border border-white/10">
              <table className="min-w-full text-left text-slate-200">
                <thead className="bg-white/5 text-slate-300 text-sm">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">COD VUELO</th>
                    <th className="px-4 py-3 whitespace-nowrap">DESTINO</th>
                    <th className="px-4 py-3 whitespace-nowrap">AEROLÍNEA</th>
                    <th className="px-4 py-3 whitespace-nowrap">SALA</th>
                    <th className="px-4 py-3 whitespace-nowrap">HORA SALIDA</th>
                    <th className="px-4 py-3 whitespace-nowrap">HORA LLEGADA</th>
                    <th className="px-4 py-3 whitespace-nowrap">DURACIÓN</th>
                    <th className="px-4 py-3 whitespace-nowrap">EDITAR</th>
                    <th className="px-4 py-3 whitespace-nowrap">VER PASAJEROS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {vuelos.map((v) => (
                    <tr key={v.codvuelo || v.id} className="text-sm">
                      <td className="px-4 py-3">{v.codvuelo}</td>
                      <td className="px-4 py-3">{v.destino?.descripcion || "-"}</td>
                      <td className="px-4 py-3">{v.aerolinea?.descripcion || "-"}</td>
                      <td className="px-4 py-3">{v.salaabordaje || "-"}</td>
                      <td className="px-4 py-3">{fmtHora(v.horasalida)}</td>
                      <td className="px-4 py-3">{fmtHora(v.horallegada)}</td>
                      <td className="px-4 py-3">{fmtDuracion(v.horasalida, v.horallegada)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/gestion-vuelos/editar/${encodeURIComponent(v.codvuelo)}`)}
                          className="h-9 px-3 rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
                        >
                          Editar
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/gestion-vuelos/pasajeros/${encodeURIComponent(v.codvuelo)}`)}
                          className="h-9 px-3 rounded-lg bg-slate-700/70 text-white hover:brightness-110"
                        >
                          Pasajeros
                        </button>
                      </td>
                    </tr>
                  ))}
                  {vuelos.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-slate-400" colSpan={9}>
                        <div className="flex items-center justify-between gap-4">
                          <span>No hay vuelos registrados.</span>
                          <button onClick={handleSeed} disabled={seeding} className="h-9 px-3 rounded-lg bg-emerald-600 text-white text-sm disabled:opacity-60">
                            {seeding ? 'Generando…' : 'Cargar datos de ejemplo'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
