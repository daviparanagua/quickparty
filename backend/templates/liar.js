let template = {
    public: {},
    start: function () {
        let activeUsers = this.currentRoom.activeUsers;
        let randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
        this.liar = randomUser;
    },
    test: function (payload) {
        console.log('event received');
        console.log(payload);
    }
}

module.exports = template;