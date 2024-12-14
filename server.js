const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;

// Conexión a MongoDB
const url = 'mongodb://localhost:27017'; // URL por defecto de MongoDB
const dbName = 'tenis_de_mesa'; // Nombre de la base de datos

app.use(express.json()); //Middleware para parsear JSON
app.use(express.urlencoded({ extended: true }));

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


// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.post('/register', async (req ,res) => {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db(dbName);
        const usuarios = db.collection('usuarios');
        const { username, email, password, confirm_password } = req.body;

        //validacion de contraseña
        if (password !== confirm_password) {
            return res.status(400).send('Las contraseñas no coinciden');
        }
        // validando si el usuario existe
        const existingUser = await usuarios.findOne({ email });
        if(existingUser){
            return res.status(400).json({error: 'El usuario ya está registrado'});
        }

        // guardar el usuarios
        const nuevoUsuario = { username, email, password };
        await usuarios.insertOne(nuevoUsuario);
        
        res.status(201).json({ message: 'Usuario registrado exitosamente'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error en el servidor'});
    } finally {
        await client.close();
    }
})
app.use(express.static(path.join(__dirname, 'public')));


