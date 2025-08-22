import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { message: 'Token no proporcionado' },
        { status: 400 }
      );
    }

    // Buscar usuario por token
    const usuario = await prisma.usuario.findFirst({
      where: { token },
    });

    if (!usuario) {
      return NextResponse.json(
        { message: 'Sesión inválida' },
        { status: 401 }
      );
    }

    // Eliminar el token
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { token: null },
    });

    return NextResponse.json(
      { message: 'Cierre de sesión exitoso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
