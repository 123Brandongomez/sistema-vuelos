import { PrismaClient } from '../../../../../generated/prisma/index.js';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombres, apellidos, email, telefono, codvuelo, foto } = body;

    // Validar campos requeridos
    if (!nombres || !apellidos || !email || !telefono || !codvuelo) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos excepto la foto' },
        { status: 400 }
      );
    }

    // Verificar que el vuelo existe
    const vuelo = await prisma.vuelo.findUnique({
      where: { codvuelo },
    });

    if (!vuelo) {
      return NextResponse.json(
        { message: 'El vuelo especificado no existe' },
        { status: 400 }
      );
    }

    // Crear el pasajero
    const pasajero = await prisma.pasajero.create({
      data: {
        nombres,
        apellidos,
        email,
        telefono: parseInt(telefono),
        codvuelo,
        foto
      },
    });

    return NextResponse.json(
      { 
        message: 'Registro exitoso del pasajero',
        pasajero 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear pasajero:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
