const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');

const jwtSecret = 'IstoEUmaPessimaIdeiaMasFuncionaPorAgora'; // TODO: Migrar para forma mais segura
const adminPassword = 'senhasecreta';

module.exports = function(commonIncludes){
    let {io, socket, users} = commonIncludes;
    const helpers = require('./helpers')(commonIncludes);

    // Registrar usuário
    users[socket.id] = {id: socket.id};    

    /**
     * authorize: Autorizar usuário com base no token
     * 
     * token
     */
    socket.on('authorize', function (payload) {
        // Novo usuário
        if (!payload.token) {
        let newUuid = uuid();
        let newToken = jwt.sign({'uuid': newUuid}, jwtSecret, {expiresIn: '7d'});

        users[socket.id].id = newUuid;

        return socket.emit('authorized', {token: newToken, uuid: newUuid});
        }

        // Usuário existente
        jwt.verify(payload.token, jwtSecret, function(err, decoded) {
        if (err) { return socket.emit('unauthorized'); } // TODO: criar ação no client para falta de autorização

        // SE OK, salvar usuário no banco e sinalizar a ele que está autorizado
        if (decoded) {
            users[socket.id].id = decoded.uuid;
            return socket.emit('authorized', {token: payload.token, uuid: decoded.uuid});
        }
      })
    });

    /**
     * admin-authorize: Autenticação de administrador
     * 
     * user
     */
    socket.on('admin-authorize', function (payload) {
        
        // Valida senha de administrador
        if(payload !== adminPassword) { return socket.emit('admin-unauthorized', {}); }
        
        // Salva indicação de que o usuário tem poderes administrativos e sinaliza ao client
        if (users[socket.id].id) {
        users[socket.id].isAdmin = true;
        return socket.emit('admin-authorized', {});
        }
    });
    
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

          let allUsers = helpers.getUsers(socket.currentRoom);
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

}
