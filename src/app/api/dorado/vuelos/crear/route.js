import { PrismaClient } from '../../../../../generated/prisma/index.js';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { codvuelo, coddestino, codaerolinea, salaabordaje, horasalida, horallegada } = body;

    // Validar campos requeridos
    if (!codvuelo || !coddestino || !codaerolinea || !salaabordaje || !horasalida || !horallegada) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el destino existe
    const destino = await prisma.destino.findUnique({
      where: { coddestino: parseInt(coddestino) },
    });

    if (!destino) {
      return NextResponse.json(
        { message: 'El destino especificado no existe' },
        { status: 400 }
      );
    }

    // Verificar que la aerolínea existe
    const aerolinea = await prisma.aerolinea.findUnique({
      where: { codaerolinea: parseInt(codaerolinea) },
    });

    if (!aerolinea) {
      return NextResponse.json(
        { message: 'La aerolínea especificada no existe' },
        { status: 400 }
      );
    }

    // Crear el vuelo
    const vuelo = await prisma.vuelo.create({
      data: {
        codvuelo,
        coddestino: parseInt(coddestino),
        codaerolinea: parseInt(codaerolinea),
        salaabordaje,
        horasalida: new Date(horasalida),
        horallegada: new Date(horallegada)
      },
    });

    return NextResponse.json(
      { 
        message: 'Registro exitoso del vuelo',
        vuelo 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear vuelo:', error);
    
    // Manejar error de clave duplicada
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Ya existe un vuelo con ese código' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
