module.exports = function(io){
  io.on('connection', function (socket) {

    console.log('Usuário conectado');

    /**
     * Mensagem de boas-vindas
     */
    socket.emit('sm', { // SM: System Message      
      body: 'Bem-vindo(a)!'
    })


  });
}