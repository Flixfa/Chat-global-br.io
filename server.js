const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Para servir arquivos estáticos

let users = {}; // Armazena usuários conectados

io.on('connection', (socket) => {
    console.log('Um usuário se conectou');

    // Receber dados de entrada
    socket.on('join', (data) => {
        users[socket.id] = data; // Armazena os dados do usuário
        socket.broadcast.emit('user joined', { name: data.name }); // Notifica todos sobre a entrada
    });

    // Receber mensagem de chat
    socket.on('chat message', (data) => {
        io.emit('chat message', data); // Envia a mensagem para todos
    });

    // Atualizar imagem de perfil
    socket.on('profile pic', (data) => {
        users[socket.id].profilePic = data.profilePic; // Atualiza a imagem do perfil
        io.emit('update profile pic', data); // Envia a atualização para todos
    });

    socket.on('disconnect', () => {
        console.log('Um usuário se desconectou');
        delete users[socket.id]; // Remove o usuário da lista
    });
});

server.listen(3000, () => {
    console.log('SERVIDOR LIGADO PARA TESTE localhost:3000');
});