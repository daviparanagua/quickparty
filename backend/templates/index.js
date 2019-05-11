let templateModule = {
    'nothing': {
        id: 'nothing',
        name: 'Nada',
        component: 'Nothing',
        action_description: 'fazer nada'
    },
    'draw': {
        id: 'draw',
        name: 'Sorteio',
        component: 'Draw',
        action_description: 'participar de um sorteio'
    }
};

Object.defineProperty(templateModule, 'load', {
    enumerable: false,
    configurable: false,
    value: function (templateId, commonIncludes){
        let {rooms, socket} = commonIncludes;
        let template = require('./' + templateId);
        let newSession = Object.assign({}, template, commonIncludes);
    
        newSession.session = {};
        newSession.currentRoom = rooms[socket.currentRoom];
        newSession.roomId = socket.currentRoom;
    
        return newSession;
    }
})

module.exports = templateModule;