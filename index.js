const colors = require("colors");
const Cell = require("./Cell");

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
                sum += data[i][j].value * data[i][j].coef
            }
        }
    }

    return sum;
}

const printMatrix = (values, a, b) => {

    for (let i = 0; i < values.length; i++) {
        let line = "";
        let isFirst = true;
        for (let j = 0; j < values[i].length; j++) {
            if (!isFirst) {
                line += "\t";
            } else {
                isFirst = false;
            }

            line += values[i][j].toString();
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

const a = [
    14, 
    25, 
    56, 
    45
];

const b = [40, 40, 20, 10, 30];

const values = [
    [10, 16, 3, 8, 5],
    [3, 14, 12, 9, 1],
    [2, 20, 4, 11, 5],
    [7, 17, 13, 8, 15]
];

let data = valuesToObjectsCell(values);

const sumA = getSum(a);
const sumB = getSum(b);

if (sumA === sumB) {
    console.log("Закрытая");
}

printMatrix(data, a, b);

while (isNotOver(data)) {
    transportAlgorithm(data, a, b);
    // printMatrix(data, a, b);
    // break;
    printMatrix(data, a, b);
    console.log("-----------------------------------------------------------------------------------------");
}

console.log("F = " + getPower(data));