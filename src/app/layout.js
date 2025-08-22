import './globals.css';

export const metadata = {
  title: "Sistema de Administración de Vuelos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
