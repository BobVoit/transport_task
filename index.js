const colors = require("colors");


const getSum = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}


const getMinElement = (matrix) => {
    let resI = 0;
    let resJ = 0;
    let resValue = 0;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (resValue < matrix[i][j]) {
                resValue = matrix[i][j];
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

const printMatrix = (values, coefs, a, b) => {

    for (let i = 0; i < values.length; i++) {
        let line = "";
        let isFirst = true;
        for (let j = 0; j < values[i].length; j++) {
            if (!isFirst) {
                line += "\t";
            } else {
                isFirst = false;
            }

            line += (values[i][j] === null ? "-" : `${values[i][j]}(${coefs[i][j]})`);
        }

        line += "\t" + colors.blue(a[i]);
        console.log(line);
    }

    console.log(colors.green(b.join("\t")));
}


const createMatrixUseCell = (matrix) => {
    return matrix.map(line => line.map(element => true));
}

const createMatrixZeros = (matrix) => {
    return matrix.map(line => line.map(element => 0));
}

const isNotOver = (matrix) => {
    let result = false;

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            result = (result !== null || result === 0) || matrix[i][j];
        }
    }

    return result; 
}

const transportAlgorithm = (values, a, b, result) => {

}

const a = [14, 25, 56, 45];
const b = [40, 40, 20, 10, 30];

let coefs = [
    [10, 16, 3, 8, 5],
    [3, 14, 12, 9, 1],
    [2, 20, 4, 11, 5],
    [7, 17, 13, 8, 15]
];


const sumA = getSum(a);
const sumB = getSum(b);

if (sumA === sumB) {
    console.log("Закрытая");
}


const values = createMatrixZeros(coefs);

printMatrix(values, coefs, a, b);


while (isNotOver(values)) {


    console.log("-----------------------------------------------------------------------------------------")
    printMatrix(values, coefs, a, b);
}
