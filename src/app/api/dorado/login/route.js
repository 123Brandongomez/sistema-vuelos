import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Se requiere nombre de usuario y contraseña' },
        { status: 400 }
      );
    }

    // Buscar usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { username },
    });

    // Verificar si el usuario existe
    if (!usuario) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    // Verificar si la contraseña es correcta
    // Primero intentamos con bcrypt si la contraseña parece estar hasheada
    let passwordMatch = false;
    
    if (usuario.password.startsWith('$2a$') || usuario.password.startsWith('$2b$')) {
      // Contraseña hasheada con bcrypt
      passwordMatch = await bcrypt.compare(password, usuario.password);
    } else {
      // Contraseña en texto plano
      passwordMatch = (password === usuario.password);
    }
    
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar token más largo y seguro (64 chars hex = 256 bits)
    const token = crypto.randomBytes(32).toString('hex');

    // Guardar el token en BD para validar la sesión luego (logout)
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { token },
    });

    return NextResponse.json(
      { 
        message: 'Autenticación exitosa',
        token,
        usuario: {
          id: usuario.id,
          username: usuario.username
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
