const templates = require('../templates');

module.exports = function(commonIncludes){
    let {io, socket, users, rooms} = commonIncludes;
    const helpers = require('./helpers')(commonIncludes);

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
        commonIncludes.currentUser = users[socket.id];

        if(helpers.isOwner()){
          users[socket.id].isAdmin = true;
        }

        // Atualizar dados do usuário
        helpers.setUserData(socket.id, payload.user);

        // Entrar na sala
        socket.join(payload.addr);
        // Obtém dados da sessão atual pro usuário
        if(rooms[socket.currentRoom].session) commonIncludes.currentSession = rooms[socket.currentRoom].session;
        
        // Sinalizar aceite do participante
        socket.emit('join-accepted', {
          addr: payload.addr,
          user: users[socket.id],
          room: helpers.getFilteredRoomInfo(payload.addr)
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
        rooms[socket.currentRoom].template = templates[payload];
        helpers.sendRoomInfo(socket.currentRoom);
    });

    /**
     * Reverter escolha de template
     */
    socket.on('clear-template', function (payload) {
        if (!users[socket.id].isAdmin) { return false; } // TODO: fazer algo mais interessante que retornar nada pra nada
        delete rooms[socket.currentRoom].template;
        helpers.sendRoomInfo(socket.currentRoom);
    });

    /**
     * Início
     */
    socket.on('start', function (options) {
        if (!users[socket.id].isAdmin) { return false; } // TODO: fazer algo mais interessante que retornar nada pra nada
        const roomId = socket.currentRoom;
        const gameTemplate = rooms[roomId].template.id;        
        rooms[roomId].session = require('../templates').load(gameTemplate, commonIncludes);
        rooms[roomId].session.activeUsers = helpers.getUsers(roomId);
        rooms[roomId].session.public.activeUsers = rooms[roomId].activeUsers;
        rooms[roomId].started = true;
        currentSession = rooms[roomId].session;
        currentSession.start(commonIncludes);
        helpers.sendRoomInfo(socket.currentRoom);
    });

    /** Ações de sessão
     * 
     */
    socket.on('session', function (payload) {
        if(!currentSession.events[payload.action] || typeof currentSession.events[payload.action] != 'function') { return false; }
        currentSession.events[payload.action].call(currentSession, payload, commonIncludes);
    });

    /**
     * Parar o jogo
     */
    socket.on('stop', function (options) {
        if (!users[socket.id].isAdmin) { return false; } // TODO: fazer algo mais interessante que retornar nada pra nada
        const roomId = socket.currentRoom;
        const gameTemplate = rooms[roomId].template.id;

        rooms[roomId].started = false;
        delete rooms[roomId].session;
        helpers.sendRoomInfo(socket.currentRoom);
    });

}