#!/bin/bash
set -e

# Esperar a que MongoDB esté disponible
echo "Esperando a que MongoDB esté disponible..."
until mongosh --host 127.0.0.1 --eval "db.runCommand({ ping: 1 })" >/dev/null 2>&1
do
  echo "Esperando a que MongoDB se inicie..."
  sleep 2
done

echo "MongoDB está disponible, inicializando datos..."

# Ejecutar el script de inicialización
mongosh --host 127.0.0.1 /docker-entrypoint-initdb.d/mongo-init.js

echo "Inicialización de datos completada."
