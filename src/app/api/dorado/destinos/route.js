import { PrismaClient } from '../../../../generated/prisma/index.js';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Obtener todos los destinos de la base de datos
    const destinos = await prisma.destino.findMany({
      orderBy: {
        coddestino: 'asc'
      }
    });

    return NextResponse.json(
      { 
        message: 'Destinos obtenidos exitosamente',
        data: destinos 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener destinos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
