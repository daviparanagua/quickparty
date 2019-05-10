module.exports = function({io, socket, users, rooms, games, helpers}){
    /**
     * Lista de salas - função administrativa
     */
    socket.on('admin-list-rooms', function () {
        if (!users[socket.id].isAdmin) { return false; } // TODO: fazer algo mais interessante que retornar nada pra nada

        let roomsInfo = {...rooms};

        Object.keys(rooms).map( (addr) => Object.assign(roomsInfo[addr], { userCount: helpers.getUsers(addr).length }) );      
        socket.emit('admin-rooms', roomsInfo);
    });

    /**
     * Lista de usuários - função administrativa
     */
    socket.on('admin-list-users', function () {
        if (!users[socket.id].isAdmin) { return false; } // TODO: fazer algo mais interessante que retornar nada pra nada
        socket.emit('admin-users', users);
    });
}