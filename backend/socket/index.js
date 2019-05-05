const uuid = require('uuid/v4');
const actions = require('../roomActions');

const adminPassword = 'senhasecreta'; // TODO: Definitivamente migrar para forma mais segura

// Catálogo de tipos de mensagens
module.exports = function(io){
  // Variáveis de "banco de dados" de usuários e salas. TODO: transportar para banco de dados
  let users = {};
  let rooms = {};
  const games = require('../games');
  
  io.on('connection', function (socket) {
    
    let commonIncludes = {io, socket, users, rooms, games};
    const helpers = require('./helpers')(commonIncludes);
    commonIncludes.helpers = helpers;
    
    require('./auth')(commonIncludes);

    /**
     * userData: Salva dados do usuário neste servidor
     * 
     * user
     */
    socket.on('userData', function (payload) {
      helpers.setUserData(socket.id, payload.user);
    });

    /**
     * userDataEdit: Salva dados de usuário editados enquanto ele está uma sala
     * 
     * user
     */
    socket.on('userDataEdit', function (payload) {
      helpers.sendSystemMessage(socket.currentRoom, users[socket.id].user.username + ' mudou seu nome para ' + payload.user.username);
      helpers.setUserData(socket.id, payload.user);

      // Atualiza os usuários e seus nomes nos participantes
      sendUserList(socket.currentRoom);
    });

    /**
     * Notifica salas de que um usuário saiu
     */
    socket.on('disconnecting', function(){
      for (roomAddr in socket.rooms){ // Todas as salas devem ser notificadas...
        if(roomAddr == socket.id){continue;} // ... menos a sala padrão do próprio usuário consigo mesmo

          let allUsers = getUsers(socket.currentRoom);
          let remainingUsers = allUsers.filter((user) => user.id != users[socket.id].id); // Ele só irá sair de fato depois, mas já enviar sem          

          // Notificar usuários e enviar nova lista aos participantes
          helpers.sendSystemMessage(roomAddr, users[socket.id].user.username + ' saiu da sala');
          io.in(socket.currentRoom).emit('users', remainingUsers);

      }
    });

    /**
     * Remove socket da lista de usuários ao desconectar de uma sala
     */
    socket.on('disconnect', function () {
      delete users[socket.id];
    });

    /**
     * Lista de salas - função administrativa
     */
    socket.on('admin-list-rooms', function () {
      if (!users[socket.id].isAdmin) { return false; } // TODO: fazer algo mais interessante que retornar nada pra nada

      let roomsInfo = {...rooms};

      Object.keys(rooms).map( (addr) => Object.assign(roomsInfo[addr], { userCount: getUsers(addr).length }) );      
      socket.emit('admin-rooms', roomsInfo);
    });

    /**
     * Lista de usuários - função administrativa
     */
    socket.on('admin-list-users', function () {
      if (!users[socket.id].isAdmin) { return false; } // TODO: fazer algo mais interessante que retornar nada pra nada
      socket.emit('admin-users', users);
    });
  });

}