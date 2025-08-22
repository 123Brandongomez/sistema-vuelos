// Script de inicialización para MongoDB
print('Iniciando script de inicialización...');

// Inicializar Replica Set (requerido por Prisma para transacciones)
try {
  const rsStatus = rs.status();
  if (rsStatus.ok === 1) {
    print('Replica set ya inicializado.');
  }
} catch (e) {
  print('Inicializando replica set rs0...');
  rs.initiate({
    _id: 'rs0',
    members: [
      { _id: 0, host: 'localhost:27017' }
    ]
  });
  print('Replica set rs0 inicializado.');
}

// Usar la base de datos dorado
db = db.getSiblingDB('dorado');

// Crear colecciones si no existen
db.createCollection('Usuario');
db.createCollection('Destino');
db.createCollection('Aerolinea');
db.createCollection('Vuelo');
db.createCollection('Pasajero');

// Datos del administrador con contraseña hasheada (admin123)
const adminData = {
  username: 'Brand403',
  password: 'Brand403',
};

// Insertar administrador si no existe
const adminExists = db.Usuario.findOne({ username: 'Brand403' });
if (!adminExists) {
  db.Usuario.insertOne(adminData);
  print('✅ Administrador creado correctamente');
} else {
  print('ℹ️ El administrador ya existe, no se creará uno nuevo');
}

// Datos de destinos
const destinos = [
  { coddestino: 1, descripcion: 'Armenia' },
  { coddestino: 2, descripcion: 'Barranquilla' },
  { coddestino: 3, descripcion: 'Cali' },
  { coddestino: 4, descripcion: 'Cartagena' },
  { coddestino: 5, descripcion: 'Medellín' },
  { coddestino: 6, descripcion: 'Santa Marta' },
  { coddestino: 7, descripcion: 'San Andrés Isla' }
];

// Eliminar destinos existentes para evitar duplicados
db.Destino.deleteMany({});
// Insertar destinos
db.Destino.insertMany(destinos);
print(`✅ ${destinos.length} destinos registrados correctamente`);

// Datos de aerolíneas
const aerolineas = [
  { codaerolinea: 1, descripcion: 'Avianca' },
  { codaerolinea: 2, descripcion: 'SATENA' },
  { codaerolinea: 3, descripcion: 'Wingo' },
  { codaerolinea: 4, descripcion: 'LATAM' },
  { codaerolinea: 5, descripcion: 'Ultra Air' },
  { codaerolinea: 6, descripcion: 'EASYFLY' }
];

// Eliminar aerolíneas existentes para evitar duplicados
db.Aerolinea.deleteMany({});
// Insertar aerolíneas
db.Aerolinea.insertMany(aerolineas);
print(`✅ ${aerolineas.length} aerolíneas registradas correctamente`);

print('¡Datos fijos y administrador registrados exitosamente!');
