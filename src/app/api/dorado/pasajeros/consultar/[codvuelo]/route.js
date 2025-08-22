import { PrismaClient } from '../../../../../../generated/prisma/index.js';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { codvuelo } = params;

    // Verificar que el vuelo existe
    const vuelo = await prisma.vuelo.findUnique({
      where: { codvuelo },
    });

    if (!vuelo) {
      return NextResponse.json(
        { message: 'Vuelo no encontrado' },
        { status: 404 }
      );
    }

    // Obtener todos los pasajeros del vuelo
    const pasajeros = await prisma.pasajero.findMany({
      where: { codvuelo },
    });

    if (pasajeros.length === 0) {
      return NextResponse.json(
        { message: 'No se encontraron pasajeros para este vuelo' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Consulta exitosa',
        pasajeros 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al consultar pasajeros:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
