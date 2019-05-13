let template = {
    public: {},
    start: function () {
        let theLiar = this.randomParticipant();
        this.addUserTag(theLiar, 'isLiar');
        
        console.log(this.tags);
        console.log('------');
        console.log(this.getUserTags(theLiar));
    },
    test: function (payload, {io, socket}) {
        console.log('event received');
        console.log(payload);
        console.log(socket.currentRoom);
        io.in(socket.currentRoom).emit('session', {action: 'test', laugh: 'kkkkkkk'})
    }
}

module.exports = template;