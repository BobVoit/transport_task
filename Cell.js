class Cell {
    constructor(coef, value = 0) {
        this.coef = coef;
        this.value = value;
        this.isUse = false;
        this.isUnavailable = false;
    }

    toString() {
        return this.isUnavailable ? "-" : `${this.value}(${this.coef})`;
    }
}