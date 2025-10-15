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

        const respuesta = await realizarQuery(query);

        if (respuesta.length == 0) {
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

app.post("/obtenerPersonajeOtroJugador", async (req, res) => {
    try {
        const idRoom = req.body.idRoom;
        const idUsuario = req.body.idUsuario;

        const query = `
      SELECT idPersonaje
      FROM Sala_Usuarios
      WHERE numero_room = ${idRoom}
        AND idUsuario <> ${idUsuario}
      LIMIT 1;
    `;

        const resultados = await realizarQuery(query);

        if (resultados.length > 0) {
            res.json({ idPersonaje: resultados[0].idPersonaje });
        } else {
            res.status(404).json({ error: "No se encontró otro jugador en la sala" });
        }
    } catch (error) {
        console.error("Error al obtener el personaje del otro jugador:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});



app.post('/entrarPartida', async function (req, res) {
    try {
        const tipo = req.body.tipo;

        if (tipo == "crear") {
            const result = await realizarQuery(`
                INSERT INTO Salas (esta_activa)
                VALUES (1);
            `);

            const nuevaRoomId = result.insertId;

            await realizarQuery(`
                INSERT INTO Sala_Usuarios (idUsuario, idPersonaje, numero_room)
                VALUES ('${req.body.user}', '${req.body.personaje}', '${nuevaRoomId}');
            `);

            res.send({
                res: "Sala creada exitosamente",
                validar: true,
                roomId: nuevaRoomId,
                empezar:true
            });

        } else if (tipo == "unirse") {
            const existe = await realizarQuery(`
                SELECT * FROM Salas 
                WHERE numero_room='${req.body.roomId}' AND esta_activa = 1;
            `);

            if (existe.length == 0) {
                return res.send({
                    res: "La sala no existe o ya no está activa",
                    validar: false
                });
            }

            await realizarQuery(`
                INSERT INTO Sala_Usuarios (idUsuario, idPersonaje, numero_room)
                VALUES ('${req.body.user}', '${req.body.personaje}', '${req.body.roomId}');
            `);

            res.send({
                res: "Jugador unido a la sala",
                validar: true,
                roomId: req.body.roomId,
                empezar:false
            });
        }

    } catch (error) {
        console.error("Error al manejar partida:", error);
        res.status(500).send({ res: "Error al procesar la partida", validar: false });
    }
});






// ===============================
// SOCKET.IO CONFIG
// ===============================
const server = app.listen(port, () => {
    console.log(`Servidor NodeJS corriendo en http://localhost:${port}/`);
});

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.on("connection", (socket) => {
    console.log("🔌 Nuevo cliente conectado");
    const req = socket.request;
    socket.on("joinRoom", (data) => {
        console.log("🚀 ~ io.on ~ req.session.room:", req.session.room);
        if (req.session.room != undefined && req.session.room.length > 0)
            socket.leave(req.session.room);
        req.session.room = data.room;
        socket.join(req.session.room);
        console.log("Te has unido a la room", req.session.room)
    });


    socket.on("sendMessage", (data) => {
        const session = socket.request.session;

        io.to(session.room).emit("newMessage", {
            room: session.room,
            validar: data.validar,
            userId: data.userId,
        });

        console.log(`📤 Mensaje enviado a sala ${session.room}`, data);
    });

    socket.on("disconnect", () => {
        console.log("❌ Cliente desconectado");
    });
});
