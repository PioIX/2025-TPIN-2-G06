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
app.get('/obtenerPersonajes', async function (req, res) {
    let respuesta;
    respuesta = await realizarQuery("SELECT * FROM Personajes")
    res.send(respuesta);
})

// OBTENER MAPAS
app.get('/obtenerMapas', async function (req, res) {
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


app.post('/desactivarSala', async function (req, res) {
    try {
        const { numero_room } = req.body;
        
        console.log(`🔒 Desactivando sala ${numero_room}`);
        
        const result = await realizarQuery(`
            UPDATE Salas
            SET esta_activa = 0
            WHERE numero_room = '${numero_room}';
        `);

        res.send({
            res: "Sala desactivada correctamente",
            validar: true
        });

    } catch (error) {
        console.error("Error al desactivar la sala:", error);
        res.status(500).send({
            res: "Error al procesar la solicitud",
            validar: false
        });
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
            // Crear nueva sala
            const result = await realizarQuery(`
                INSERT INTO Salas (esta_activa)
                VALUES (1);
            `);

            const nuevaRoomId = result.insertId;

            // Insertar primer jugador
            await realizarQuery(`
                INSERT INTO Sala_Usuarios (idUsuario, idPersonaje, numero_room)
                VALUES ('${req.body.user}', '${req.body.personaje}', '${nuevaRoomId}');
            `);

            res.send({
                res: "Sala creada exitosamente",
                validar: true,
                roomId: nuevaRoomId,
                empezar: true
            });

        } else if (tipo == "unirse") {
            // Verificar si la sala existe y está activa
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

            // Contar cuántos jugadores hay en la sala
            const jugadores = await realizarQuery(`
                SELECT COUNT(*) AS cantidad FROM Sala_Usuarios
                WHERE numero_room='${req.body.roomId}';
            `);

            const cantidad = jugadores[0].cantidad;

            if (cantidad >= 2) {
                // Sala llena
                return res.send({
                    res: "La sala ya tiene 2 jugadores y no admite más.",
                    validar: false
                });
            }

            // Insertar nuevo jugador
            await realizarQuery(`
                INSERT INTO Sala_Usuarios (idUsuario, idPersonaje, numero_room)
                VALUES ('${req.body.user}', '${req.body.personaje}', '${req.body.roomId}');
            `);

            res.send({
                res: "Jugador unido a la sala",
                validar: true,
                roomId: req.body.roomId,
                empezar: false
            });
        }

    } catch (error) {
        console.error("Error al manejar partida:", error);
        res.status(500).send({ res: "Error al procesar la partida", validar: false });
    }
});

app.post('/actualizarSala', async function (req, res) {
    try {
        const resultSala = await realizarQuery(`
            UPDATE Salas
            SET idGanador = '${req.body.idGanador}', esta_activa = 0
            WHERE numero_room = '${req.body.numero_room}';
        `);

        const resultUsuario = await realizarQuery(`
            UPDATE Usuarios
            SET victorias = victorias + 1
            WHERE idUsuario = '${req.body.idGanador}';
        `);

        res.send({
            res: "Sala actualizada correctamente",
            validar: true
        });

    } catch (error) {
        console.error("Error al actualizar la sala:", error);
        res.status(500).send({
            res: "Error al procesar la solicitud",
            validar: false
        });
    }
});

app.post('/setearPerdedor', async function (req, res) {
    try {
        const resultUsuario = await realizarQuery(`
            UPDATE Usuarios
            SET derrotas = derrotas + 1
            WHERE idUsuario = '${req.body.idPerdedor}';
        `);

        res.send({
            res: "Sala actualizada correctamente",
            validar: true
        });

    } catch (error) {
        console.error("Error al actualizar la sala:", error);
        res.status(500).send({
            res: "Error al procesar la solicitud",
            validar: false
        });
    }
});


// ===============================
// SOCKET.IO CONFIG
// ===============================
// ===============================
// SOCKET.IO CONFIG
// ===============================
const server = app.listen(port, () => {
    console.log(`Servidor NodeJS corriendo en http://localhost:${port}/`);
});

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://10.1.5.132:3001"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Map para trackear jugadores EN PARTIDA
const jugadoresEnPartida = new Map(); // key: socketId, value: { room, idUsuario }

io.on("connection", (socket) => {
    console.log("🔌 Nuevo cliente conectado:", socket.id);
    const req = socket.request;

    socket.on("joinRoom", (data) => {
        console.log("🚀 ~ io.on ~ req.session.room:", req.session.room);
        if (req.session.room != undefined && req.session.room.length > 0)
            socket.leave(req.session.room);
        req.session.room = data.room;
        socket.join(req.session.room);
        console.log("Te has unido a la room", req.session.room);
    });

    // NUEVO: Registrar que un jugador está activamente EN LA PARTIDA
    socket.on("registrarEnPartida", (data) => {
        const { room, idUsuario } = data;
        jugadoresEnPartida.set(socket.id, { room, idUsuario });
        console.log(`✅ Jugador ${idUsuario} registrado en partida (sala ${room})`);
        console.log("Jugadores activos en partida:", jugadoresEnPartida.size);
    });

    // NUEVO: Cuando el jugador sale de la página de juego normalmente
    socket.on("salirDePartida", (data) => {
        const { idUsuario } = data;
        jugadoresEnPartida.delete(socket.id);
        console.log(`👋 Jugador ${idUsuario} salió normalmente de la partida`);
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

    socket.on("cambiarTurno", (data) => {
        const session = socket.request.session;

        io.to(session.room).emit("validarCambioTurno", {
            check: true,
            idUsuario: data.idUsuario,
            numeroTurno: data.numeroTurno,
            daño: data.daño,
            nombreHabilidad: data.nombreHabilidad,
            esquiva: data.esquiva
        });

        console.log(`📤 Cambio en la sala ${session.room}`, data);
    });

    socket.on("avisar", (data) => {
        const session = socket.request.session;

        io.to(session.room).emit("avisito", {
            idUsuario: data.data,
        });

        console.log(`📤 Cambio en la sala ${session.room}`, data);
    });

    socket.on("ganador", (data) => {
        const session = socket.request.session;
        console.log(data.idUsuario);
        io.to(session.room).emit("ganadorAviso", {
            idUsuario: data.idUsuario,
        });
    });

    socket.on("disconnect", () => {
        const room = req.session.room;

        // SOLO cancelar partida si el jugador estaba registrado en partida
        if (jugadoresEnPartida.has(socket.id)) {
            const jugadorInfo = jugadoresEnPartida.get(socket.id);
            console.log(`❌ Jugador ${jugadorInfo.idUsuario} desconectado DURANTE PARTIDA en sala ${jugadorInfo.room}`);

            // Avisar a todos los jugadores que la partida fue cancelada
            io.to(jugadorInfo.room).emit("partidaCancelada", {
                motivo: "Un jugador abandonó la partida",
                idUsuarioDesconectado: jugadorInfo.idUsuario
            });

            // Limpiar del map
            jugadoresEnPartida.delete(socket.id);

            // Dejar la sala
            socket.leave(jugadorInfo.room);
        } else {
            console.log(`❌ Cliente desconectado (no estaba en partida)`);
        }
    });

    socket.on("avisar", (data) => {
        const session = socket.request.session;

        // Si es un aviso de abandono por recarga
        if (data.tipo === "abandonoRecarga") {
            console.log(`🔄 Jugador ${data.data} abandonó por recarga`);

            // Avisar a todos en la sala que la partida fue cancelada
            io.to(session.room).emit("partidaCancelada", {
                motivo: "Un jugador recargó la página",
                idUsuarioDesconectado: data.data
            });

            return;
        }

        io.to(session.room).emit("avisito", {
            idUsuario: data.data,
        });

        console.log(`📤 Cambio en la sala ${session.room}`, data);
    });

    // Agregar este nuevo evento en el backend después de "salirDePartida"
    socket.on("jugadorRecargo", (data) => {
        const { room, idUsuario } = data;

        console.log(`🔄 Jugador ${idUsuario} recargó la página en sala ${room}`);

        // Avisar a TODOS en la sala (incluido el que recargó) que la partida fue cancelada
        io.to(room).emit("partidaCancelada", {
            motivo: "Un jugador recargó la página",
            idUsuarioDesconectado: idUsuario
        });

        // Limpiar del map
        jugadoresEnPartida.delete(socket.id);
    });
});
