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

// LOGIN
app.post('/usuariosLogin', async (req, res) => {
    console.log(req.body);
    try {
        let respuesta = await realizarQuery(`
            SELECT * FROM Usuarios
            WHERE mail='${req.body.mail}' 
            AND contraseña='${req.body.contraseña}'
        `);
        if (respuesta.length > 0) {
            req.session.user = {
                id: respuesta[0].idUsuario,
                mail: respuesta[0].mail
            };
            res.send({ res: true, correo: respuesta[0].mail, id: respuesta[0].idUsuario });
        } else {
            res.send({ res: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error en /usuariosLogin:", error);
        res.status(500).send({ res: "Error en el servidor" });
    }
});

// REGISTRO
app.post('/usuariosRegistro', async (req, res) => {
    console.log(req.body);
    let respuesta = await realizarQuery(`SELECT * FROM Usuarios WHERE mail='${req.body.mail}'`);
    if (respuesta.length === 0) {
        await realizarQuery(`
            INSERT INTO Usuarios (mail, contraseña, nombre) VALUES
            ("${req.body.mail}", "${req.body.contraseña}", "${req.body.nombre}");
        `);
        res.send({ res: "Usuario agregado", validar: true });
    } else {
        res.send({ res: "Usuario con este mail ya existe", validar: false });
    }
});

// OBTENER PERSONAJES
app.get('/obtenerPersonajes', async function(req,res){
    let respuesta;
    respuesta = await realizarQuery("SELECT * FROM Personajes")
    res.send(respuesta);
})

// OBTENER MAPAS
app.get('/obtenerMapas', async function(req,res){
    let respuesta;
    respuesta = await realizarQuery("SELECT * FROM Mapas")
    res.send(respuesta);
})

// OBTENER PARTIDAS
app.get('/obtenerPartidas', async function (req, res) {
    try {
        const respuesta = await realizarQuery(`
            SELECT idUsuario, nombre, victorias, derrotas 
            FROM Usuarios
        `);
        res.json(respuesta); // importante: devuelve JSON
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener las partidas");
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

const rooms = {}; // { "room1": ["juani", "santi"] }

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

    socket.on('sendMessage', data => {
        io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data });
    });


    socket.on('entrarPartida', data => {
        const user = data.id;
        const roomId = data.room;

        // Si ya estaba en otra sala, salir y eliminarlo
        if (req.session.room && rooms[req.session.room]) {
            socket.leave(req.session.room);
            const users = rooms[req.session.room];
            for (let i = 0; i < users.length; i++) {
                if (users[i] === user) {
                    users.splice(i, 1);
                    i--;
                }
            }
        }

        // Crear la sala si no existe
        if (!rooms[roomId]) {
            rooms[roomId] = [];
        }

        const users = rooms[roomId];

        // Si el usuario ya está, no hacer nada
        let yaEnSala = false;
        for (let i = 0; i < users.length; i++) {
            if (users[i] === user) {
                yaEnSala = true;
            }
        }

        // Si hay más de 2 usuarios y no es uno de los existentes → no puede entrar
        if (users.length >= 2 && !yaEnSala) {
            socket.emit('errorPartida', { mensaje: 'La sala está llena (máximo 2 jugadores).' });
            console.log(`Usuario ${user} no pudo entrar: sala ${roomId} llena.`);
            return;
        }

        // Solo agregar si no estaba antes
        if (!yaEnSala) {
            users.push(user);
        }

        req.session.room = roomId;
        socket.join(roomId);

        console.log(`Usuario ${user} entró a la sala ${roomId}. Jugadores: ${users.length}`);
        io.to(roomId).emit('partida', {
            user,
            room: roomId,
            jugadores: users
        });
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
