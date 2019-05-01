/**
 * Função de apoio a registro de eventos recebidos pelo chat após o aceite em entrada na sala
 *
 * !!! APÓS O ACEITE EM ENTRADA NA SALA !!! NÃO TENTE REGISTRAR EVENTOS QUE DEVEM OCORRER ANTES DO joinRoom()!!!
 *
 * Esta função faz uso do Function.prototype.call de forma a definir this como a própria instância do Vue. Deste modo, é possível intercambiar facilmente funções entre este local e o Vue single-file.
 *
 */
export default function () {
  // SM: System Message: Mensagem do sistema
  this.socket.on('sm', (message) => {
    this.addMessage(message);
  });

  // UM: User Message: Mensagem de usuário
  this.socket.on('um', (message) => {
    this.addMessage(message);
  });

  // USERS: Lista de usuários na sala
  this.socket.on('users', (users) => {
    let orderedUsers = (users.sort((a, b) => {
      if (a.user.username < b.user.username) { return -1; };
      if (a.user.username > b.user.username) { return 1; };
      return 0;
    }));
    this.users = orderedUsers;
  });
};
