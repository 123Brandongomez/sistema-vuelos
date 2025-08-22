import { PrismaClient } from '../../../../generated/prisma/index.js';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const aerolineas = await prisma.aerolinea.findMany({
      orderBy: { codaerolinea: 'asc' }
    });

    return NextResponse.json(
      {
        message: 'Aerolíneas obtenidas exitosamente',
        data: aerolineas,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener aerolíneas:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
