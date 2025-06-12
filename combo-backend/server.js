// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Para permitir peticiones desde tu frontend Angular

const app = express();
const port = 3500; // Puedes usar otro puerto si lo necesitas

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost', // O la IP de tu servidor MySQL
    user: 'root', // Tu usuario de MySQL
    password: '', // Tu contraseña de MySQL (¡no usar en producción directamente!)
    database: 'test' // El nombre de tu base de datos
});

// Conectar a MySQL
db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL con id ' + db.threadId);
});

// Middleware para permitir CORS (Cross-Origin Resource Sharing)
// Esto es CRUCIAL para que tu frontend Angular pueda hacer peticiones al backend
app.use(cors());
app.use(express.json()); // Para parsear JSON en las peticiones

// RUTA API: Obtener la lista de personal
app.get('/api/personal', (req, res) => {
    const sql = 'SELECT DNI, NOMBRE FROM personal';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta: ' + err.message);
            res.status(500).json({ error: 'Error al obtener personal' });
            return;
        }
        res.json(results); // Envía los resultados como JSON
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});