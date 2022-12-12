const colors = require("colors");
const Cell = require("./Cell");

const Actions = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT"
}

let mainCounter = 0;

const getSum = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

const getMinElementCoef = (matrix) => {
    let resI = 0;
    let resJ = 0;
    let resValue = Number.MAX_VALUE;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (!matrix[i][j].isUse) {
                continue;
            }

            if (resValue > matrix[i][j].coef) {
                resValue = matrix[i][j].coef;
                resI = i;
                resJ = j;
            }
        }
    }

    return {
        i: resI,
        j: resJ,
        value: resValue
    };
}

const getPower = (data) => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (!data[i][j].isUnavailable) {
                sum += data[i][j].value * data[i][j].coef;
            }
        }
    }

    return sum;
}

const printMatrix = (values, a, b, showNotUse = true) => {

    for (let i = 0; i < values.length; i++) {
        let line = "";
        let isFirst = true;
        for (let j = 0; j < values[i].length; j++) {
            if (!isFirst) {
                line += "\t";
            } else {
                isFirst = false;
            }

            line += values[i][j].toString(showNotUse);
        }

        line += "\t" + colors.blue(a[i]);
        console.log(line);
    }

    console.log(colors.green(b.join("\t")));
}

const isNotOver = (values) => {
    for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values[i].length; j++) {
            if (values[i][j].isUse) {
                return true;
            }
        }
    }
    return false; 
}

const clearSign = (data) => {
    data.forEach(line => line.forEach(element => {
        element.sign = "";
    }));
}

const valuesToObjectsCell = (values) => {
    return values.map(line => line.map(element => new Cell(element)));
}

const transportAlgorithm = (data, a, b) => {
    const minObj = getMinElementCoef(data); 
    
    const currentI = minObj.i;
    const currentJ = minObj.j;
    
    console.log(`(${currentI}; ${currentJ})`);

    const aValue = a[currentI];
    const bValue = b[currentJ];

    if (aValue > bValue) {
        data[currentI][currentJ].setValue(bValue);
        a[currentI] -= bValue;

        for (let i = 0; i < data.length; i++) {
            if (i === currentI || !data[i][currentJ].isUse) {
                continue;
            }

            data[i][currentJ].setIsUnavailable(true);
            data[i][currentJ].setIsUse(false);
        }
    } else {
        data[currentI][currentJ].setValue(aValue);
        b[currentJ] -= aValue;

        for (let j = 0; j < data[currentI].length; j++) {
            if (j === currentJ || !data[currentI][j].isUse) {
                continue;
            }

            data[currentI][j].setIsUnavailable(true);
            data[currentI][j].setIsUse(false);
        }
    }

    data[currentI][currentJ].setIsUse(false);

}

const arrayHaveNull = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === null) {
            return true;
        }
    }

    return false;
}

const potentials = (data, a1, b1) => {
    a1[0] = 0;
    while (arrayHaveNull(a1) || arrayHaveNull(b1)) {
        // console.log(a1);
        // console.log(b1);
        // printMatrix(data, a, b, true);
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (!data[i][j].isUnavailable) {
                    const a1Value = a1[i];
                    const b1Value = b1[j];
                    const currentValue = data[i][j].coef;
                    if (a1Value === null && b1Value !== null) {
                        a1[i] = currentValue - b1Value;
                    } else if (a1Value !== null && b1Value === null) {
                        b1[j] = currentValue - a1Value;
                    }
                }  
            }
        }  
    }
}

const copyArrayOfPoints = (arr) => {
    return arr.map(point => ({ ...point }));
}

const findCycleRecursion = (data, iValue, jValue, points, action, startPoint) => {

    if (iValue === startPoint.i && jValue === startPoint.j) {
        return points;
    }
    
    if (iValue >= data.length || iValue < 0) {
        return null;
    }

    if (jValue >= data[iValue].length || jValue < 0) {
        return null;
    }

    let result = null;
    if (data[iValue][jValue].isUnavailable) {

        let i = 0;
        let j = 0;
        if (action === Actions.UP) {
            i = iValue;
            j = jValue - 1;
        } else if (action === Actions.DOWN) {
            i = iValue;
            j = jValue + 1;
        } else if (action === Actions.LEFT) {
            i = iValue - 1;
            j = jValue;
        } else if (action === Actions.RIGHT) {
            i = iValue + 1;
            j = jValue;
        }
        result = findCycleRecursion(data, i, j, copyArrayOfPoints(points), Actions.LEFT, startPoint);
    } else {
        points.push({ i: iValue, j: jValue });
 
        if (action !== Actions.LEFT) {
            result = findCycleRecursion(data, iValue + 1, jValue, copyArrayOfPoints(points), Actions.RIGHT, startPoint);
            if (result !== null) {
                return result;
            }
        }

        if (action !== Actions.RIGHT) {
            result = findCycleRecursion(data, iValue - 1, jValue, copyArrayOfPoints(points), Actions.LEFT, startPoint);
            if (result !== null) {
                return result;
            }
        }

        if (action !== Actions.UP) {
            result = findCycleRecursion(data, iValue, jValue + 1, copyArrayOfPoints(points), Actions.DOWN, startPoint);
            if (result !== null) {
                return result;
            }
        }

        if (action !== Actions.DOWN) {
            result = findCycleRecursion(data, iValue, jValue - 1, copyArrayOfPoints(points), Actions.UP, startPoint);
            if (result !== null) {
                return result;
            }
        }
    }

    return null;

}

const findCycle = (data, iValue, jValue) => {

    const startPoint = { i: iValue, j: jValue };
    const points = [
        startPoint
    ];

    let result = null;
    result = findCycleRecursion(data, iValue - 1, jValue, copyArrayOfPoints(points), Actions.LEFT, startPoint);
    if (result !== null) {
        return result;
    }

    result = findCycleRecursion(data, iValue + 1, jValue, copyArrayOfPoints(points), Actions.RIGHT, startPoint);
    if (result !== null) {
        return result;
    }

    result = findCycleRecursion(data, iValue, jValue - 1, copyArrayOfPoints(points), Actions.UP, startPoint);
    if (result !== null) {
        return result;
    }

    result = findCycleRecursion(data, iValue, jValue + 1, copyArrayOfPoints(points), Actions.DOWN, startPoint);
    if (result !== null) {
        return result;
    }

    return null;
}

const findCycle2 = (data, iValue, jValue, ijArray) => {
    mainCounter = data.length * data[iValue].length;
    return findCycleHorizontal(data, iValue, jValue, ijArray, iValue, jValue);
}

const findCycleHorizontal = (data, iValue, jValue, ijArray, iStart, jStart) => {
    mainCounter--;
    if (mainCounter === 0) {
        throw new Error("Много итераций в цикле");
    }
    for (let j = 0; j < data[iValue].length; j++) {
        if (j === jValue) {
            continue;
        }
        if (data[iValue][j].isUnavailable) {
            continue;
        }
        if (findCycleVertical(data, iValue, j, ijArray, iStart, jStart)) {
            // iArray.push(iValue);
            // jArray.push(j);
            ijArray.push({ i: iValue, j: j });
            return true;
        }
    }
    return false;
}

const findCycleVertical = (data, iValue, jValue, ijArray, iStart, jStart) => {
    for (let i = 0; i < data.length; i++) {
        if (i === iStart && jStart === jValue) {
            // iArray.push(iValue);
            // jArray.push(jValue);
            ijArray.push({ i: i, j: jValue });
            return true;
        }
        if (i === iValue) {
            continue;
        }
        if (data[i][jValue].isUnavailable) {
            continue;
        }
        if (findCycleHorizontal(data, i, jValue, ijArray, iStart, jStart)) {
            // iArray.push(i);
            // jArray.push(jValue);
            ijArray.push({ i: i, j: jValue });
            return true;
        }
    }  
    return false;  
}

const optimisation = (data, a1, b1) => {

    for (let i = 0; i < a1.length; i++) {
        a1[i] = null;
    }
    for (let i = 0; i < b1.length; i++) {
        b1[i] = null;
    }

    potentials(data, a1, b1);

    let maxValue = Number.MIN_VALUE;
    let iValue = null;
    let jValue = null;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j].isUnavailable) {
                const a1Value = a1[i];
                const b1Value = b1[j];
                const value =  a1Value + b1Value - data[i][j].coef;
                if (value >= 0) {
                    if (value > maxValue) {
                        maxValue = value;
                        iValue = i;
                        jValue = j;
                    }
                }
            }  
        }
    }

    if (iValue === null || jValue === null) {
        return;
    }

    // data[iValue][jValue].sign = "+";

    const peaks = [];
    // const ijArray = [];
    findCycle2(data, iValue, jValue, peaks);

    let currentSign = true;
    let minValue = Number.MAX_VALUE;
    let iMin = 0;
    let jMin = 0;
    peaks.forEach(element => {
        data[element.i][element.j].sign = currentSign ? "+" : "-";
        if (!currentSign && minValue > data[element.i][element.j].value) {
            minValue = data[element.i][element.j].value;
            iMin = element.i;
            jMin = element.j;
        }
        data[element.i][element.j].setIsUnavailable(false);
        currentSign = !currentSign;
    });

    data[iMin][jMin].setIsUnavailable(true); 

    peaks.forEach(element => {
        const currentElement = data[element.i][element.j];
        if (currentElement.sign === "+") {
            currentElement.value += minValue;
        } else if (currentElement.sign === "-") {
            currentElement.value -= minValue;
        }
    });

    clearSign(data);

    optimisation(data, a1, b1);

    // const iArray = [];
    // const jArray = [];
}

// const a = [
//     28, 
//     13, 
//     15, 
//     30
// ];

// const b = [27, 16, 25, 11, 7];

// const values = [
//     [2, 24, 4, 2, 3],
//     [20, 10, 15, 27, 7],
//     [15, 15, 12, 25, 19],
//     [2, 6, 3, 5, 5]
// ];

const a = [
    17, 
    14, 
    21, 
    43
];

const b = [19, 22, 23, 17, 14];

const values = [
    [12, 11, 25, 17, 21],
    [22, 18, 14, 8, 1],
    [9, 13, 2, 28, 15],
    [26, 21, 3, 4, 27]
];

const a1 = [null, null, null, null];
const b1 = [null, null, null, null, null];

let data = valuesToObjectsCell(values);

const sumA = getSum(a);
const sumB = getSum(b);

if (sumA === sumB) {
    console.log("Закрытая");
}

printMatrix(data, a, b);

while (isNotOver(data)) {
    transportAlgorithm(data, a, b);
    printMatrix(data, a, b);
    console.log("-----------------------------------------------------------------------------------------");
}

console.log("F = " + getPower(data));


console.log("-----------------------------------------------------------------------------------------");
console.log("Оптимизация");

//potentials(data, a1, b1);
optimisation(data, a, b);
printMatrix(data, a, b, false);
console.log("F = " + getPower(data));