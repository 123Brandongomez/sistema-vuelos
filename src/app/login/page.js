"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/dorado/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Error al iniciar sesión");
      }

      setSuccess("Autenticación exitosa ✓");

      // Guardar token de sesión
      if (data?.token) {
        try { localStorage.setItem("token", data.token); } catch (_) {}
      }

      // Redirigir a Gestión de Vuelos
      setTimeout(() => router.push("/gestion-vuelos"), 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-900 to-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900/70 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-indigo-500/25 to-teal-400/25 border-b border-white/10">
          <h1 className="text-zinc-100 text-xl font-semibold">Bienvenido</h1>
          <p className="text-zinc-400 text-sm mt-1">Inicia sesión para continuar</p>
        </div>

        <form className="p-6" onSubmit={handleSubmit}>
          {error ? (
            <div className="mb-3 rounded-xl border border-red-500/35 bg-red-500/10 px-3 py-2 text-rose-200 text-sm">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="mb-3 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-emerald-100 text-sm">
              {success}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-slate-300 text-sm" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              className="h-11 rounded-xl border border-slate-500/30 bg-slate-950/60 text-slate-100 px-3 outline-none placeholder-slate-500 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/60"
              type="text"
              placeholder="Ingresa tu usuario"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-slate-300 text-sm" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              className="h-11 rounded-xl border border-slate-500/30 bg-slate-950/60 text-slate-100 px-3 outline-none placeholder-slate-500 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/60"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between gap-3 mt-2">
            <button
              className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold tracking-wide transition hover:brightness-105 active:translate-y-px disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
