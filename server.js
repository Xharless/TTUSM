const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;

// Conexión a MongoDB
const url = 'mongodb://localhost:27017'; // URL por defecto de MongoDB
const dbName = 'tenis_de_mesa'; // Nombre de la base de datos

async function main() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Conectado a MongoDB');
        
        // Seleccionar la base de datos
        const db = client.db(dbName);
        
        // Seleccionar la colección (tabla en MongoDB)
        const jugadores = db.collection('jugadores');

        // Definir ruta para mostrar jugadores
        app.get('/jugadores', async (req, res) => {
            const allJugadores = await jugadores.find({}).toArray();
            res.json(allJugadores); // Enviar jugadores como JSON
        });
        
    } catch (err) {
        console.error(err);
    }
}

main().catch(console.error);

app.use(express.static(path.join(__dirname, 'public')));
// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
