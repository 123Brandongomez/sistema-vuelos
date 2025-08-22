import { PrismaClient } from '../../../../../../generated/prisma/index.js';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { codvuelo } = params;
    const body = await request.json();
    const { coddestino, codaerolinea, salaabordaje, horasalida, horallegada } = body;

    // Verificar que el vuelo existe
    const vueloExistente = await prisma.vuelo.findUnique({
      where: { codvuelo },
    });

    if (!vueloExistente) {
      return NextResponse.json(
        { message: 'Vuelo no encontrado' },
        { status: 404 }
      );
    }

    // Preparar datos para actualizar
    const datosActualizados = {};
    
    if (coddestino !== undefined) {
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
      datosActualizados.coddestino = parseInt(coddestino);
    }

    if (codaerolinea !== undefined) {
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
      datosActualizados.codaerolinea = parseInt(codaerolinea);
    }

    if (salaabordaje !== undefined) datosActualizados.salaabordaje = salaabordaje;
    if (horasalida !== undefined) datosActualizados.horasalida = new Date(horasalida);
    if (horallegada !== undefined) datosActualizados.horallegada = new Date(horallegada);

    // Actualizar el vuelo
    const vueloActualizado = await prisma.vuelo.update({
      where: { codvuelo },
      data: datosActualizados,
    });

    return NextResponse.json(
      { 
        message: 'Edición exitosa',
        vuelo: vueloActualizado 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al editar vuelo:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
