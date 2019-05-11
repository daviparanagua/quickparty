let template = {
    public: {},
    start: function() {
        let activeUsers = this.currentRoom.activeUsers;
        let randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
        this.public.chosenUser = randomUser;
    }
}

module.exports = template;