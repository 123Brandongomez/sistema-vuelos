"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ListadoPasajerosPorVuelo() {
  const router = useRouter();
  const routeParams = useParams();
  const codvuelo = routeParams?.codvuelo ? String(routeParams.codvuelo) : undefined;

  const [vuelo, setVuelo] = useState(null);
  const [pasajeros, setPasajeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        // Obtener vuelos y filtrar por código para mostrar destino en el título
        const vuelosRes = await fetch("/api/dorado/vuelos/consultar");
        const vuelosData = await vuelosRes.json().catch(() => ({}));
        if (vuelosRes.ok) {
          const v = Array.isArray(vuelosData?.vuelos)
            ? vuelosData.vuelos.find((x) => x.codvuelo === codvuelo)
            : null;
          setVuelo(v || null);
        }

        // Obtener pasajeros para el vuelo
        const res = await fetch(`/api/dorado/pasajeros/consultar/${encodeURIComponent(codvuelo)}`);
        if (res.status === 404) {
          setPasajeros([]);
          setError("");
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Error al consultar pasajeros");
        setPasajeros(Array.isArray(data?.pasajeros) ? data.pasajeros : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (codvuelo) loadData();
  }, [codvuelo]);

  async function handleEliminar(id) {
    if (!id) return;
    const ok = confirm("¿Seguro que deseas eliminar este pasajero?");
    if (!ok) return;
    try {
      const res = await fetch(`/api/dorado/pasajeros/eliminar/${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "No se pudo eliminar");
      // Refrescar lista
      setPasajeros((list) => list.filter((p) => p.id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  const titulo = useMemo(() => {
    if (!vuelo) return `Listado Pasajeros - Vuelo ${codvuelo}`;
    const destino = vuelo?.destino?.descripcion ? ` - ${vuelo.destino.descripcion}` : "";
    return `Listado Pasajeros - Vuelo ${vuelo.codvuelo}${destino}`;
  }, [vuelo, codvuelo]);

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
          <h2 className="text-slate-300 text-lg font-medium underline underline-offset-4">{titulo}</h2>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-slate-400 text-sm">Cargando…</div>
          ) : error ? (
            <div className="text-rose-300 text-sm">{error}</div>
          ) : (
            <div className="overflow-auto rounded-xl border border-white/10 bg-white/5">
              <table className="min-w-full text-left text-slate-200">
                <thead className="bg-white/5 text-slate-300 text-sm">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">FOTO</th>
                    <th className="px-4 py-3 whitespace-nowrap">IDENTIFICACIÓN</th>
                    <th className="px-4 py-3 whitespace-nowrap">NOMBRES</th>
                    <th className="px-4 py-3 whitespace-nowrap">APELLIDOS</th>
                    <th className="px-4 py-3 whitespace-nowrap">EMAIL</th>
                    <th className="px-4 py-3 whitespace-nowrap">TELÉFONO</th>
                    <th className="px-4 py-3 whitespace-nowrap">CANCELAR VUELO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {pasajeros.map((p) => (
                    <tr key={p.id} className="text-sm">
                      <td className="px-4 py-3">
                        {p.foto ? (
                          <img
                            src={p.foto}
                            alt={`Foto de ${p.nombres || ''} ${p.apellidos || ''}`.trim() || 'Foto pasajero'}
                            className="h-10 w-10 rounded-full object-cover border border-white/10 bg-white/5"
                          />
                        ) : (
                          <div
                            className="h-10 w-10 rounded-full bg-white/10 text-slate-300 flex items-center justify-center border border-white/10"
                            title={`${p.nombres || ''} ${p.apellidos || ''}`.trim()}
                          >
                            {`${(p.nombres || '').charAt(0)}${(p.apellidos || '').charAt(0)}`.toUpperCase() || '—'}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3">{p.nombres}</td>
                      <td className="px-4 py-3">{p.apellidos}</td>
                      <td className="px-4 py-3">{p.email}</td>
                      <td className="px-4 py-3">{p.telefono}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEliminar(p.id)}
                          className="h-9 px-3 rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pasajeros.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-slate-400" colSpan={7}>
                        No hay pasajeros registrados para este vuelo.
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
