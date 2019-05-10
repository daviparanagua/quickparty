const actions = require('../roomActions');

const adminPassword = 'senhasecreta'; // TODO: Definitivamente migrar para forma mais segura

// Catálogo de tipos de mensagens
module.exports = function(io){
  // Variáveis de "banco de dados" de usuários e salas. TODO: transportar para banco de dados
  let users = {};
  let rooms = {};
  
  io.on('connection', function (socket) {
    let commonIncludes = {io, socket, users, rooms};
    const helpers = require('./helpers')(commonIncludes);
    commonIncludes.helpers = helpers;

    require('./auth')(commonIncludes);
    require('./admin')(commonIncludes);
    require('./room')(commonIncludes);


  });
}