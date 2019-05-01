module.exports = function(message, parameters){
    let action = message.body.substr(4);

    return {parsedBy: 'is', action};
}