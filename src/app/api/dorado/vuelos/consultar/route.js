import { PrismaClient } from '../../../../../generated/prisma/index.js';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Obtener todos los vuelos con información de destino y aerolínea
    const vuelos = await prisma.vuelo.findMany({
      include: {
        destino: true,
        aerolinea: true, 
      },
    });

    if (vuelos.length === 0) {
      return NextResponse.json(
        { message: 'No se encontraron vuelos registrados' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Consulta exitosa',
        vuelos 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al consultar vuelos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
