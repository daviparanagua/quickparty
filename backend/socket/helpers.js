// FUNÇÕES ACESSÓRIAS

module.exports = function({io, socket, users, rooms, games}){
    let helpers = {};

    helpers.render = function (room) {
        if(helpers.isOwner()){
            return 'Bem-vindo(a)! Aguarde todos entrarem e pressione OK quando estiver pronto';
        }
        return 'Bem-vindo(a)! Aguardando todos entrarem';
    }

    // Enviar mensagem de sistema
    helpers.sendSystemMessage = function (room, msg) {
        io.in(socket.currentRoom).emit('err', msg);
    }

    /**
     * Salva os dados do usuário no armazenamento do servidor
     * 
     * @param {*} socketId 
     * @param {*} userData 
     */
    helpers.setUserData = function (socketId, userData){
        users[socketId].user = userData;
    }

    /**
     * Obtém os usuários conectados a uma sala
     * 
     * @param {*} room 
     */
    helpers.getUsers = function(room){
        if(!socket.adapter.rooms[room]){ return {}; }

        return Object.keys(socket.adapter.rooms[room].sockets).map((socketId) => users[socketId] );
    }

    /**
     * Envia aos participantes de uma sala a lista atualizada de participantes
     * 
     * @param {*} room 
     */
    helpers.sendUserList = function (room){
        io.in(room).emit('users', helpers.getUsers(room));
    }

    /**
     * É o dono da sala em que está?
     */

    helpers.isOwner = function() {
        return socket.id == rooms[socket.currentRoom].owner;
    }

    return helpers;   
}