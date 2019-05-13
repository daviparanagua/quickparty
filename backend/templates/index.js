let templateModule = {
    'liar': {
        id: 'liar',
        name: 'O Mentiroso',
        component: 'Liar',
        action_description: 'jogar O Mentiroso',
        players: {
            min: 1,
            max: 15
        }
    },
    'draw': {
        id: 'draw',
        name: 'Sorteio',
        component: 'Draw',
        action_description: 'participar de um sorteio',
        players: {
            min: 1
        }
    }
};

Object.defineProperty(templateModule, 'load', {
    enumerable: false,
    configurable: false,
    value: function (templateId, commonIncludes){
        let {rooms, socket} = commonIncludes;
        let commonHelpers = require('./roomHelpers');
        let template = require('./' + templateId);
        let newSession = Object.assign({}, template, commonHelpers, commonIncludes);
    
        newSession.public = {};
        newSession.private = {};
        newSession.tags = {};
        newSession.currentRoom = rooms[socket.currentRoom];
        newSession.roomId = socket.currentRoom;
    
        return newSession;
    }
})

module.exports = templateModule;