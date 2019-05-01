module.exports = function(message, parameters){
    let quantifier = (parameters[1] || '1D6').split(/[Dd]/);
    let amount = parseInt(quantifier[0]) || 1;
    let sides = parseInt(quantifier[1]) || 6;

    if (isNaN(amount) || isNaN(sides) ){
        throw 'Você não pode rolar dados com tantos lados. Role um dado de até 100 faces';
        return;
    }

    if (amount > 20){
        throw 'Você não pode rolar tantos dados de uma só vez. Role até 20 dados por vez';
        return;
    }

    if (sides > 100){
        throw 'Você não pode rolar dados com tantos lados. Role um dado de até 100 faces';
        return;
    }

    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    let outcomes = [];

    for(let i = 0; i<amount; i++){
        outcomes.push(Math.floor(Math.random() * sides) + 1);
    }

    let result = outcomes.reduce(reducer);

    return {parsedBy: 'roll', action: `${message.sender} rolou ${amount}D${sides} e obteve ${result} (${outcomes.join(', ')})`};
}