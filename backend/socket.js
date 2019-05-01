const uuid = require('uuid/v4');

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

  let users = {};
  let rooms = {};

  io.on('connection', function (socket) {

    // Registrar usuário
    users[socket.id] = {id: socket.id};

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

      socket.currentRoom = payload.addr;

      // Atualizar dados do usuário
      setUserData(socket.id, payload.user);

      // Entrar
      socket.join(payload.addr);
      socket.emit('join-accepted', {
        addr: payload.addr,
        messages: rooms[payload.addr].messages 
      });

      // Notificar demais participantes      
      sendSystemMessage(socket.currentRoom, users[socket.id].user.username + ' entrou na sala');
      sendUserList(socket.currentRoom);
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
     * userData: Dados de usuário
     * 
     * user
     */
    socket.on('userData', function (payload) {
      setUserData(socket.id, payload.user);
    });

    /**
     * userDataEdit: Dados de usuário editados enquanto ele está uma sala
     * 
     * user
     */
    socket.on('userDataEdit', function (payload) {
      sendSystemMessage(socket.currentRoom, users[socket.id].user.username + ' mudou seu nome para ' + payload.user.username);
      setUserData(socket.id, payload.user);
      sendUserList(socket.currentRoom);
    });

     /**
     * users: Usuários conectados
     * 
     * user
     */
    socket.on('users', function (payload) {
      //socket.emit('users', getUsers(socket.currentRoom));
    });

    /**
     * Notifica salas de que usuário saiu
     */
    socket.on('disconnecting', function(){
      for (roomAddr in socket.rooms){
        if(roomAddr == socket.id){continue;}

          let allUsers = getUsers(socket.currentRoom);
          let remainingUsers = allUsers.filter((user) => user.id != socket.id);

          sendSystemMessage(roomAddr, users[socket.id].user.username + ' saiu da sala');
          io.in(socket.currentRoom).emit('users', remainingUsers);

      }
    });

    /**
     * Limpa variáveis ao desconectar
     */
    socket.on('disconnected', function () {
      delete users[socket.id];
    });

    // FUNÇÕES ACESSÓRIAS

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
     * Salva uma mensagem no histórico, se parametrizado, e a envia ao participantes de uma sala
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

      // Adiciona o ID de usuário a mensagens do usuário
      if(type === 'user'){
        responsePayload.userId = users[socket.id].user.uuid;
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