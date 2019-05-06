const templates = require('../templates');

module.exports = function({io, socket, users, rooms, games, helpers}){
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
          room: filterRoomInfo(rooms[payload.addr])
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
        console.log(templates);
        socket.emit('templates', templates);
    });

    /**
     * Lista de salas - função administrativa
     */
    socket.on('room-set-template', function () {
        if (!users[socket.id].isAdmin) { return false; } // TODO: fazer algo mais interessante que retornar nada pra nada

        let roomsInfo = {...rooms};

        Object.keys(rooms).map( (addr) => Object.assign(roomsInfo[addr], { userCount: getUsers(addr).length }) );      
        socket.emit('admin-rooms', roomsInfo);
    });

    function filterRoomInfo(room) {
        return room;
    }


}