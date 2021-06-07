function normalize (dice) {
    // Returns a dice array whose values sum to one (i.e. a probability distribution)
    console.log("normalize was opened");
    var total = sum(dice);

    for (let i = 0; i < dice.length; i++) {
        dice[i] = dice[i]/total;
    };
    
    return dice;
};

function sum (dice) {
    // Returns the sum of the values in a dice array (i.e. the total number of possible rolls of the given type, if the dice array is not normalized)
    
    var sum = 0;

    for (let i = 0; i < dice.length; i++) {
        sum = sum + dice[i];
    };

    return sum;
};