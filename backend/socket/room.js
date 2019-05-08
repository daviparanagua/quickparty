const templates = require('../templates');

module.exports = function({io, socket, users, rooms, helpers}){
    /**
     * join-request: Solicitação de entrada em sala
     * 
     * addr Endereço da sala
     */
    socket.on('join-request', function (payload) {
        // Cria a sala, se ela não existir
        if(!rooms[payload.addr]){
            rooms[payload.addr] = {
                addr: payload.addr,
                state: 'waiting',
                owner: users[socket.id].id
            };
        }

        // Salva no socket qual é a sala a que esta conectado
        socket.currentRoom = payload.addr;
        if(helpers.isOwner()){
          users[socket.id].isAdmin = true;
        }

        // Atualizar dados do usuário
        helpers.setUserData(socket.id, payload.user);

        // Entrar na sala
        socket.join(payload.addr);
        
        // Sinalizar aceite do participante
        socket.emit('join-accepted', {
          addr: payload.addr,
          user: users[socket.id],
          room: helpers.getRoom(payload.addr)
        });

        // Renderizar tela inicial
        socket.emit('render', {
        content: helpers.render(payload.addr)
        });

        // Notificar demais participantes da entrada
        helpers.sendSystemMessage(socket.currentRoom, users[socket.id].user.username + ' entrou na sala');
        helpers.sendUserList(socket.currentRoom);
    });

    /**
     * Lista de templates
     */
    socket.on('get-templates', function () {
        socket.emit('templates', templates);
    });

    /**
     * Escolha de template
     */
    socket.on('select-template', function (payload) {
        if (!users[socket.id].isAdmin) { return false; } // TODO: fazer algo mais interessante que retornar nada pra nada
        if (!templates[payload]) { return false; } // TODO DEFINIR ERRO: TEMPLATE NÃO EXISTE
        console.log(payload);
        rooms[socket.currentRoom].template = templates[payload];
        io.in(socket.currentRoom).emit('room', rooms[socket.currentRoom] );
    });

    /**
     * Início
     */
    socket.on('start', function (options) {
        if (!users[socket.id].isAdmin) { return false; } // TODO: fazer algo mais interessante que retornar nada pra nada

        let roomId = socket.currentRoom;
        rooms[roomId].started = true;
        helpers.sendRoomInfo(socket.currentRoom);
    });

}