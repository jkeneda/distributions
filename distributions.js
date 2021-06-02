// Implementation: works with an array dice[] such that dice[i] = # of ways of rolling an i with the given dice
// Functions: convolve, d(n), makeData, normalize, sum

function convolve(diceA, diceB){
    // Returns dice array corresponding to diceA + diceB

    var dice = [];

    // Loop over diceA and diceB to count the number of ways of getting the sum to be i+j
    for (var i = 0; i < diceA.length; i++) {
        for (var j = 0; j < diceB.length; j++) {
            if (typeof dice[i+j] != 'number') {
                dice[i+j] = 0;
            };

            dice[i+j] = dice[i+j] + diceA[i]*diceB[j]; // Add the number of ways of getting i + j via diceA showing i and diceB showing j
            
            // for debugging:
            // console.log("dice["+ i + "+" + j + "] is now " + dice[i+j]);
        };
    };

    return dice;
};

function d (n) {
    // Returns an array of size n+1 of the form [0, 1, 1, ..., 1]
    // Note that d(4) = [0, 1, 1, 1, 1] is a d4, etc.

    var dice = [0];
    if (n>0) {
        for (var i = 1; i <= n; i++) {
            dice[i] = 1;
        };
    };

    return dice;
};

function makeData (dice, title) {
    // Returns data from a dice array and the graph title string
    // Makes labels equal to the list of outcomes and height given by number of ways of rolling the given outcome (or probability of such an outcome if the dice are normalized)

    var labels = [], data;

    for (var i = 0; i < dice.length; i++){
        labels[i] = i;
    };

    data = {
        labels: labels,
        datasets: [{
            label: title,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: dice,
        }]
    };

    return data;
};

function normalize (dice) {
    // Returns a dice array whose values sum to one (i.e. a probability distribution)

    var total = sum(dice);

    for (var i = 0; i < dice.length; i++) {
        dice[i] = dice[i]/total;
    };

    return dice;
};

function sum (dice) {
    // Returns the sum of the values in a dice array (i.e. the total number of possible rolls of the given type, if the dice array is not normalized)
    
    var sum = 0;

    for (var i = 0; i < dice.length; i++) {
        sum = sum + dice[i];
    };

    return sum;
};