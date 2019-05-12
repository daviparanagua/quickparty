let template = {
    public: {},
    start: function () {
        let activeUsers = this.currentRoom.activeUsers;
        let randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
        this.liar = randomUser;
    },
    test: function (payload, {io, socket}) {
        console.log('event received');
        console.log(payload);
        console.log(socket.currentRoom);
        io.in(socket.currentRoom).emit('session', {action: 'test', laugh: 'kkkkkkk'})
    }
}

module.exports = template;