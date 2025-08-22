"use client";

import { useEffect, useState } from "react";

export default function DocumentPage() {
  const [theme, setTheme] = useState("light");

  // OpenAPI spec embebido (puedes ampliarlo cuando quieras)
  const spec = {
    openapi: "3.0.3",
    info: {
      title: "Sistema de Administración de Vuelos - API",
      version: "1.0.0",
      description: "Documentación de la API bajo /api/dorado",
    },
    servers: [{ url: "" }],
    tags: [
      { name: "Auth" },
      { name: "Destinos" },
      { name: "Pasajeros" },
      { name: "Vuelos" },
    ],
    paths: {
      "/api/dorado/destinos": {
        get: {
          summary: "Listar destinos",
          tags: ["Destinos"],
          responses: { 200: { description: "OK" } },
        },
      },
      "/api/dorado/login": {
        post: {
          summary: "Login",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    password: { type: "string", format: "password" },
                  },
                  required: ["username", "password"],
                },
              },
            },
          },
          responses: { 200: { description: "OK" } },
        },
      },
      "/api/dorado/logout": {
        post: {
          summary: "Logout",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { token: { type: "string" } },
                  required: ["token"],
                },
              },
            },
          },
          responses: { 200: { description: "OK" } },
        },
      },
      "/api/dorado/pasajeros/consultar/{codvuelo}": {
        get: {
          summary: "Pasajeros por vuelo",
          tags: ["Pasajeros"],
          parameters: [
            { name: "codvuelo", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { 200: { description: "OK" } },
        },
      },
      "/api/dorado/pasajeros/crear": {
        post: {
          summary: "Crear pasajero",
          tags: ["Pasajeros"],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object" } } },
          },
          responses: { 201: { description: "Creado" } },
        },
      },
      "/api/dorado/pasajeros/eliminar/{id}": {
        delete: {
          summary: "Eliminar pasajero",
          tags: ["Pasajeros"],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { 204: { description: "Sin contenido" } },
        },
      },
      "/api/dorado/vuelos/consultar": {
        get: {
          summary: "Listar vuelos",
          tags: ["Vuelos"],
          responses: { 200: { description: "OK" } },
        },
      },
      "/api/dorado/vuelos/crear": {
        post: {
          summary: "Crear vuelo",
          tags: ["Vuelos"],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object" } } },
          },
          responses: { 201: { description: "Creado" } },
        },
      },
      "/api/dorado/vuelos/editar/{codvuelo}": {
        put: {
          summary: "Editar vuelo",
          tags: ["Vuelos"],
          parameters: [
            { name: "codvuelo", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object" } } },
          },
          responses: { 200: { description: "OK" } },
        },
      },
    },
  };

  useEffect(() => {
    // Inject Swagger UI CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css";
    document.head.appendChild(link);

    // Load Swagger UI bundle
    const script = document.createElement("script");
    script.src = "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.SwaggerUIBundle) {
        // @ts-ignore
        window.SwaggerUIBundle({
          spec,
          dom_id: "#swagger-root",
          presets: [
            // @ts-ignore
            window.SwaggerUIBundle.presets.apis,
          ],
          layout: "BaseLayout",
          docExpansion: "none",
          defaultModelsExpandDepth: 0,
          deepLinking: false,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Topbar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "var(--panel)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
              Documentación de la API
            </div>
          </div>
          <button
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            style={{
              background: "transparent",
              border: `1px solid var(--border)`,
              color: "var(--text)",
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
            }}
            aria-label="Cambiar tema"
          >
            {theme === "light" ? "🌙 Modo oscuro" : "☀️ Modo claro"}
          </button>
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>
        <div
          style={{
            background: "var(--panel)",
            border: `1px solid var(--border)`,
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <div id="swagger-root" />
        </div>
      </main>

      {/* Theme + Swagger overrides */}
      <style jsx global>{`
        /* Theme vars */
        [data-theme='light'] { --bg: #f6f7fb; --panel: #ffffff; --text: #0f172a; --muted: #475569; --border: #e5e7eb; }
        [data-theme='dark'] { --bg: #0b1120; --panel: #0f172a; --text: #e5e7eb; --muted: #9aa3b2; --border: rgba(255,255,255,0.1); }

        /* Hide default top bar */
        .swagger-ui .topbar { display: none; }
        .swagger-ui { color: var(--text); }
        .swagger-ui .info .title { color: var(--text); }
        .swagger-ui .opblock { background: var(--panel); border-color: var(--border); }
        .swagger-ui .opblock .opblock-summary { background: var(--panel); border-bottom: 1px solid var(--border); }
        .swagger-ui .opblock-tag { color: var(--text); }
        .swagger-ui .model, .swagger-ui .model-title, .swagger-ui .response-col_description__inner p { color: var(--text); }
        .swagger-ui .model-box, .swagger-ui .opblock-body pre { background: var(--bg); color: var(--text); border-color: var(--border); }
        .swagger-ui .parameters-col_description input[type='text'],
        .swagger-ui select, .swagger-ui textarea { background: var(--bg); color: var(--text); border-color: var(--border); }
        .swagger-ui .btn { background: var(--panel); border-color: var(--border); color: var(--text); }
        .swagger-ui table thead tr th { color: var(--muted); }
        .swagger-ui .info { margin: 0; padding: 16px 16px 0; }
        .swagger-ui .scheme-container { padding: 0 16px 16px; background: transparent; }
      `}</style>
    </div>
  );
}
