// Implementation: works with an array dice[] such that dice[i] = # of ways of rolling an i with the given dice
// Functions: convolve, d(n) (also its Number.prototype version), makeData, makeChart, makeNormalizedChart, normalize, readInput, sum, textToDice

// To-do: work on displaying averages (maybe std deviations) and multiple graphs simultaneously,
// make the graphing dynamic and handle negative shifts

function convolve () { // Takes any number of dice as arguments
    // Returns dice array corresponding to the independent sum of all arguments

    var diceA = arguments[0]; // A
    var diceB = arguments[1];  // B
    var dice = [];  // to become A+B

    if (arguments.length > 2) {

        for (let k = 0; k < arguments.length; k++) {

            if (dice.length == 0) {
                dice = [1];
            };

            dice = convolve(dice, arguments[k]); // convolve identity with arguments one by one

        };
    };

    if (arguments.length == 2) {
        // Loop over diceA and diceB to count the number of ways of getting the sum to be i+j
        for (let i = 0; i < diceA.length; i++) {
            for (let j = 0; j < diceB.length; j++) {
                if (typeof dice[i + j] != 'number') {
                    dice[i + j] = 0;
                };

                dice[i + j] = dice[i + j] + diceA[i] * diceB[j]; // Add the number of ways of getting i + j via diceA showing i and diceB showing j

                // for debugging:
                // console.log("dice["+ i + "+" + j + "] is now " + dice[i+j]);
            };
        };
    };

    if (arguments.length == 1) {
        
        return diceA; // nothing to convolve with
    }

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

    if (dice == [0]) {
        dice = [1]; // default to Dirac mass at 0 if loop didn't work out
    }

    return dice;
};

// Idea: add d to Number.prototype so that 3.d(6) is 3d6, etc.

Number.prototype.d = function (n) {

    var dice = [1];

    if (this > 0) {
        for (let i = 0; i < this; i++){

            dice = convolve(dice, d(n));

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

function makeChart (chartID, inputString) { // chartID is the string with html id of the chart, and inputString is the user's dice combo, e.g. 3d10

    const config = {
        type: 'bar',
        data: makeData(textToDice(inputString), inputString),
        options: {
            scales: {
                xAxes: [{
                    type: 'linear', // Hopefully lets me display averages better? Not sure if this works yet.
                }]
            }
        }
    };

    var myChart = new Chart(
        document.getElementById(chartID),
        config
    );

};

function makeNormalizedChart (chartID, inputString) { // chartID is the string with html id of the chart, and inputString is the user's dice combo, e.g. 3d10

    const config = {
        type: 'bar',
        data: makeData(normalize(textToDice(inputString)), inputString),
        options: {
            scales: {
                xAxes: [{
                    type: 'linear', // Hopefully lets me display averages better? Not sure if this works yet.
                }]
            }
        }
    };

    var myChart = new Chart(
        document.getElementById(chartID),
        config
    );

};

function normalize (dice) {
    // Returns a dice array whose values sum to one (i.e. a probability distribution)

    var total = sum(dice);

    for (var i = 0; i < dice.length; i++) {
        dice[i] = dice[i]/total;
    };

    return dice;
};

function readInput () {
    // Needs implementation
};

function sum (dice) {
    // Returns the sum of the values in a dice array (i.e. the total number of possible rolls of the given type, if the dice array is not normalized)
    
    var sum = 0;

    for (var i = 0; i < dice.length; i++) {
        sum = sum + dice[i];
    };

    return sum;
};

function textToDice (text) {
    // Returns a dice array corresponding to the given sum 
    // e.g. textToDice(d4 + 1) returns [0, 0, 1, 1, 1, 1]

    // First split by + signs and eliminate whitespace

    var textArray = text.split(/\s*\+\s*/); // splits at whitespace + whitespace
    var halves = []; // for splitting e.g. 3d6 into [3, 6]

    var dice = [1]; // Dirac mass at 0, to be convolved up to the full sum
    var shift = 0; // Tracks the constant summands and performs a final shift to the dice
    var shiftedDice = []; // Populated and returned if there's a net positive shift

    for (let i = 0; i < textArray.length; i++) {

        // Parse summands textArray[i]

        if (textArray[i].match(/[0-9]*\s*d\s*[0-9]/)) { // If the word is 3d6, split and call ().d() with halves

            halves = textArray[i].split(/\s*d\s*/);

            if (halves[0] === "") {

                dice = convolve(dice, d(parseInt(halves[1])));

            };

            if (typeof halves[0] !== "") {

                dice = convolve(dice, (parseInt(halves[0]).d(parseInt(halves[1]))));

            };
        }

        else if (!isNaN(textArray[i])) { // If it's numeric, then add it to the shift

            shift = shift + parseInt(textArray[i]);

        };

    };

    // dice currently holds an unshifted distribution, so we finish by shifting the index in dice.  Only works for net positive shifts at the moment.

    if (shift > 0) {

        for (let j = 0; j < dice.length; j++) {

            shiftedDice[dice.length - 1 - j + shift] = dice[dice.length - 1 - j]; // Shift to the right, starting at the end

        };

        for (let k = 0; k < shift; k++) {

            shiftedDice[k] = 0;

        };

        return shiftedDice;

    };

    return dice;
};