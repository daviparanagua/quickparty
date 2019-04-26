module.exports = function(io){
  io.on('connection', function (socket) {

    console.log('Usuário conectado');

    // Mensagem de boas-vindas
    socket.emit('um', {
      type: 'system',
      body: 'Bem-vindo(a)!'
    })

  });
}