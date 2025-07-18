import express from 'express';              // Servidor web
import logger from 'morgan';                // Logger
import dotenv from 'dotenv';                // Variables de entorno
import mysql from 'mysql2';                  // Para usar BD
import bodyParser from 'body-parser';        // Ordenar información
import cors from 'cors';                     // Permitir peticiones
import { fileURLToPath } from 'url';         // Manejo de rutas de archivos
import path from 'path';                    // Manejo de rutas de archivos
import cron from 'node-cron';           // Tareas programadas

//Rutas
import usersRoutes   from './routes/users.js';
import settingsRoutes   from './routes/settings.js';
import pricesRoutes  from './routes/prices.js';
import visitsRoutes  from './routes/visits.js';
import visitorsRoutes from './routes/visitors.js';
import paymentsRoutes from './routes/payments.js';
import ticketsRoutes  from './routes/tickets.js';

//Modelo para manejar tokens de refresco
import RefreshToken from './models/RefreshToken.js';

//Nombre del archivo y directorio para almacenar QRs
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

//Cargar variables de entorno
dotenv.config();

const app = express(); //Crear servidor API
const PORT = process.env.PORT; //Puerto de la app

//Conectar a la base de datos
const conexion = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT,
});

//Configurar servidor API
app.use(cors());
app.use(logger('dev')); //dev para debuggear en modo desarrollo
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());

const qrDir = path.resolve(__dirname, 'uploads', 'qr');
app.use('/qr', express.static(path.join(__dirname, 'uploads', 'qr')));

//Rutas agrupadas
app.use(usersRoutes);
app.use(settingsRoutes);
app.use(pricesRoutes);
app.use(visitsRoutes);
app.use(visitorsRoutes);
app.use(paymentsRoutes);
app.use(ticketsRoutes);

//Ruta por defecto
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no válida' });
});

//Tarea programada para limpiar tokens expirados
cron.schedule('0 0 * * *', async () => {
  timezone: 'America/Mexico_City'
  try {
    await RefreshToken.destroy({
      where: { expires_at: { [Op.lt]: new Date() } }
    });
  } catch (err) {
    console.error('Error limpiando refresh tokens:', err);
  }
});

//Verificar la conexión a la DB
conexion.getConnection((error)=>{
    if(error){
        console.log("No se pudo conectar a la DB");
    } else{
        console.log("Conectado a la DB");
        app.listen(PORT, ()=>{
            console.log("Servidor API funcionando")
        });
    }
});