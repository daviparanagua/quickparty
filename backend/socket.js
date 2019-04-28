module.exports = function(io){
  io.on('connection', function (socket) {

    console.log('Usuário conectado');

    /**
     * Mensagem de boas-vindas
     */
    socket.emit('sm', { // SM: System Message      
      body: 'Bem-vindo(a)!'
    })

    /**
     * join-request: Solicitação de entrada em sala
     * 
     * addr Endereço da sala
     */
    socket.on('join-request', function (payload) {
      console.log(payload);
      socket.join(payload.addr);
      console.log(`Usuário conectado a ${payload.addr}`);
      socket.emit('sm', { body:`Você está na sala ${payload.addr}` });
    });

    /**
     * user: Mensagem gerada por usuário
     * 
     * sender
     * room
     * body
     */
    socket.on('um', function (payload) {
      let responsePayload = Object.assign(payload, {
        socket: socket.id
      });
      console.log(responsePayload);
      socket.to(payload.room).emit('um', responsePayload);

      socket.emit('um', responsePayload);
    });

  });
}