// ===============================
// IMPORTS Y CONFIGURACIÓN INICIAL
// ===============================
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Session
const sessionMiddleware = session({
    secret: "supersarasa",   // Cambiar por algo más seguro en producción
    resave: false,
    saveUninitialized: false
});
app.use(sessionMiddleware);


// ===============================
//           RUTAS HTTP
// ===============================

app.get('/', (req, res) => {
    res.status(200).send({ message: 'GET Home route working fine!' });
});

app.post('/encontrarPersonaje', async function (req, res) {
    try {
        const id = req.body.idHabilidad; // <-- extraemos el ID del body
        console.log("ID recibido:", id);

        if (!id) {
            return res.status(400).send({ mensaje: 'No se envió ID de personaje' });
        }

        // Consulta SQL usando template literal (cuidado con inyección SQL)
        const query = `
            SELECT 
                p.idPersonaje,
                p.nombre,
                p.tipo,
                p.velocidad,
                p.salud,
                p.energia,
                p.fotoPersonaje,
                p.fuerza,
                h.idHabilidad,
                h.nombre AS nombreHabilidad,
                h.daño,
                h.es_especial,
                h.consumo
            FROM Personajes p
            INNER JOIN Habilidades_personajes hp ON p.idPersonaje = hp.idPersonaje
            INNER JOIN Habilidades h ON hp.idHabilidad = h.idHabilidad
            WHERE p.idPersonaje = ${id} 
        `;

        // <-- Aquí NO usamos idHabilidad
        const respuesta = await realizarQuery(query);

        if (respuesta.length === 0) {
            return res.status(404).send({ mensaje: 'Personaje no encontrado' });
        }

        const personaje = {
            idPersonaje: respuesta[0].idPersonaje,
            nombre: respuesta[0].nombre,
            tipo: respuesta[0].tipo,
            velocidad: respuesta[0].velocidad,
            saludMax: parseInt(respuesta[0].salud),
            saludActual: parseInt(respuesta[0].salud),
            energiaActual: parseInt(respuesta[0].energia),
            energiaMax: parseInt(respuesta[0].energia),
            fotoPersonaje: respuesta[0].fotoPersonaje,
            fuerza: respuesta[0].fuerza,
            habilidades: []
        };

        for (let i = 0; i < respuesta.length; i++) {
            personaje.habilidades.push({
                idHabilidad: respuesta[i].idHabilidad,
                nombre: respuesta[i].nombreHabilidad,
                daño: respuesta[i].daño,
                es_especial: respuesta[i].es_especial,
                consumo: respuesta[i].consumo
            });
        }

        res.send({ res: personaje });

    } catch (error) {
        console.error(error);
        res.status(500).send({ mensaje: 'Error en el servidor' });
    }
});





// ===============================
//       SOCKET.IO CONFIG
// ===============================
const server = app.listen(port, () => {
    console.log(`Servidor NodeJS corriendo en http://localhost:${port}/`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Middleware de sesión en socket.io
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});


// Eventos socket
io.on("connection", (socket) => {
    const req = socket.request;
    console.log("🔌 Nuevo cliente conectado");

    socket.on('joinRoom', data => {
        if (req.session.room) socket.leave(req.session.room);
        req.session.room = data.room;
        socket.join(req.session.room);
        console.log(data.mensaje);
        io.to(req.session.room).emit('chat-messages', { user: req.session.user, room: req.session.room });
    });

    socket.on('pingAll', data => {
        console.log("PING ALL: ", data);
        io.emit('pingAll', { event: "Ping to all", message: data });
    });

    socket.on('mandarDatosInicio', data => {
        console.log(data)
        io.to(req.session.room).emit('recibirDatosInicio', { room: req.session.room, data: data.data.res, id: data.id });
    });


    socket.on('entrarPartida', data => {
        const user = data.id;
        const roomId = data.room;
        const personaje = data.personaje
        

        req.session.room = roomId;
        socket.join(roomId);

        console.log(`Usuario ${user} entró a la sala ${roomId}. Jugadores: ${users.length}`);
        io.to(req.session.room).emit('recibirDatosInicio', { room: req.session.room, data: data.data.res, id: data.id });
    });



    socket.on('disconnect', () => {
        console.log("Cliente desconectado");

        const roomId = req.session.room;
        const user = req.session.user;

        if (roomId && rooms[roomId]) {
            // Vaciar la sala (eliminar todos los usuarios)
            rooms[roomId] = [];
            console.log(`Sala ${roomId} vaciada por desconexión de ${user}`);

            // Notificar a todos en la sala que se vació
            io.to(roomId).emit('partida-vacia', { room: roomId });
        }
    });


});
