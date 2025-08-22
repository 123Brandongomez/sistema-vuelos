import { PrismaClient } from '../../../../../../generated/prisma/index.js';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Verificar que el ID es válido    
    if (!id) {
      return NextResponse.json(
        { message: 'ID de pasajero no proporcionado' },
        { status: 400 }
      );
    }

    // Verificar que el pasajero existe
    const pasajero = await prisma.pasajero.findUnique({
      where: { id },
    });

    if (!pasajero) {
      return NextResponse.json(
        { message: 'Pasajero no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el pasajero
    await prisma.pasajero.delete({
      where: { id },
    });

    // Retornar 200 OK con mensaje para indicar eliminación exitosa
    return NextResponse.json(
      { message: 'pasajero eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar pasajero:', error);
    
    // Si el error es por un formato de ID inválido
    if (error.code === 'P2023') {
      return NextResponse.json(
        { message: 'Formato de ID inválido' },
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
