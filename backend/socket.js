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
     * Solicitação de entrada em sala
     */
    socket.on('join-request', function (payload) {
      console.log(payload);
      socket.join(payload.addr);
      console.log(`Usuário conectado a ${payload.addr}`);
      socket.emit('sm', { body:`Você está na sala ${payload.addr}` });
    });


  });
}