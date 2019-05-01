const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const actions = require('../roomActions');

const jwtSecret = 'IstoEUmaPessimaIdeiaMasFuncionaPorAgora'; // TODO: Migrar para forma mais segura
const adminPassword = 'senhasecreta'; // TODO: Definitivamente migrar para forma mais segura

// Catálogo de tipos de mensagens
module.exports = function(io){
  const TYPES = {
    user: {
      clientType: 'user',
      saveInHistory: true,
      socketEvent: 'um'
    },
    system: {
      clientType: 'system',
      saveInHistory: true,
      socketEvent: 'sm'
    }
  }

  // Variáveis de "banco de dados" de usuários e salas. TODO: transportar para banco de dados
  let users = {};
  let rooms = {};

  io.on('connection', function (socket) {

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
          messages: []
        };
      }

      // Salva no socket qual é a sala a que esta conectado
      socket.currentRoom = payload.addr;

      // Atualizar dados do usuário
      setUserData(socket.id, payload.user);

      // Entrar na sala
      socket.join(payload.addr);
      
      // Sinalizar aceite do participante
      socket.emit('join-accepted', {
        addr: payload.addr,
        messages: rooms[payload.addr].messages // TODO: enviando o histórico inteiro para cumprir especificações, mas precisa mesmo? Implantar infinite scrolling
      });

      // Notificar demais participantes da entrada
      sendSystemMessage(socket.currentRoom, users[socket.id].user.username + ' entrou na sala');
      sendUserList(socket.currentRoom);
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
     * um: Mensagem gerada por usuário
     * 
     * sender
     * room
     * body
     */
    socket.on('um', function (payload) {
      saveAndEmitMessage(socket.currentRoom, payload);
    });

    /**
     * userData: Salva dados do usuário neste servidor
     * 
     * user
     */
    socket.on('userData', function (payload) {
      setUserData(socket.id, payload.user);
    });

    /**
     * userDataEdit: Salva dados de usuário editados enquanto ele está uma sala
     * 
     * user
     */
    socket.on('userDataEdit', function (payload) {
      sendSystemMessage(socket.currentRoom, users[socket.id].user.username + ' mudou seu nome para ' + payload.user.username);
      setUserData(socket.id, payload.user);

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
          let remainingUsers = allUsers.filter((user) => user.id != socket.id); // Ele só irá sair de fato depois, mas já enviar sem

          // Notificar usuários e enviar nova lista aos participantes
          sendSystemMessage(roomAddr, users[socket.id].user.username + ' saiu da sala');
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

    // FUNÇÕES ACESSÓRIAS

    /**
     * Realiza interpretação de uma mensagem, identificando se é uma ação, chamando a função correspondente e realizando as transformações necessárias
     * 
     * @param {*} message 
     */
    function parseMessage(message){
      if(message.body.substr(0, 1) == '/'){
        let actionParameters = message.body.match(new RegExp('[A-Za-z0-9_-]+', 'g'));
        let action = actionParameters[0];
        if(actions[action]){
            return Object.assign(message, actions[action](message, actionParameters), {type: 'action'});
        } else {
            throw `Ação /${action} não reconhecida`;
        }
      }
  
      return message;
  }

    /**
     * Parametriza e envia uma mensagem de sistema a uma sala
     * 
     * @param {*} msg Mensagem a enviar
     */
    function sendSystemMessage(roomAddr, msg){
      return saveAndEmitMessage(roomAddr, {
        body: msg,
      }, 'system');
    }

    /**
     * Adiciona as propriedades padrão de mensagem, invoca o parsing, salva uma mensagem no histórico, se parametrizado, e envia ao participantes de uma sala // TODO: esta função faz muitas coisas
     * 
     * @param {*} roomAddr
     * @param {*} payload 
     * @param {*} type 
     */
    function saveAndEmitMessage(roomAddr, payload, type = 'user') {
      let responsePayload = Object.assign(payload, {
        type: TYPES[type].clientType,
        timestamp: Date.now(),
        id: uuid()
      });

      // Se for uma mensagem de usuário, adiciona o ID do usuário e chama o parser
      if(type === 'user'){
        responsePayload.userId = users[socket.id].id;
        try {
          responsePayload = parseMessage(responsePayload);
        } catch (error) {
          return socket.emit('err', error);
        }
      }

      // Cria histórico de mensagens
      if(TYPES[type].saveInHistory){
        rooms[roomAddr].messages.push(responsePayload);
      }

      // Envia mensagem aos participantes
      socket.to(roomAddr).emit(TYPES[type].socketEvent, responsePayload);
      socket.emit(TYPES[type].socketEvent, responsePayload); // TODO: manter mensagem no client e substituir por confirmação apenas
      return true;
    }

    /**
     * Salva os dados do usuário no armazenamento do servidor
     * 
     * @param {*} socketId 
     * @param {*} userData 
     */
    function setUserData(socketId, userData){
      users[socketId].user = userData;
    }
    
    /**
     * Obtém os usuários conectados a uma sala
     * 
     * @param {*} room 
     */
    function getUsers(room){
      if(!socket.adapter.rooms[room]){ return {}; }

      return Object.keys(socket.adapter.rooms[room].sockets).map((socketId) => users[socketId] );
    }
    
    /**
     * Envia aos participantes de uma sala a lista atualizada de participantes
     * 
     * @param {*} room 
     */
    function sendUserList(room){
      io.in(room).emit('users', getUsers(room));
    }

  });

}