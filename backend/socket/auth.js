const jwt = require('jsonwebtoken');
const jwtSecret = 'IstoEUmaPessimaIdeiaMasFuncionaPorAgora'; // TODO: Migrar para forma mais segura

module.exports = function({io, socket, users, rooms, games, helpers}){
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
     * join-request: Solicitação de entrada em sala
     * 
     * addr Endereço da sala
     */
    socket.on('join-request', function (payload) {
        // Cria a sala, se ela não existir
        if(!rooms[payload.addr]){
        rooms[payload.addr] = {
            addr: payload.addr,
            state: 'waiting'
        };
        }

        // Salva no socket qual é a sala a que esta conectado
        socket.currentRoom = payload.addr;

        // Atualizar dados do usuário
        helpers.setUserData(socket.id, payload.user);

        // Entrar na sala
        socket.join(payload.addr);
        
        // Sinalizar aceite do participante
        socket.emit('join-accepted', {
        addr: payload.addr
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
}