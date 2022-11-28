class Cell {
    constructor(coef, value = 0) {
        this.coef = coef;
        this.value = value;
        this.isUse = true;
        this.isUnavailable = false;
    }

    toString() {
        return this.isUnavailable ? "-" : `${this.value}(${this.coef})`;
    }

    setIsUnavailable(isUnavailable) {
        this.isUnavailable = isUnavailable;
    }

    setValue(value) {
        this.value = value;
    }

    setIsUse(isUse) {
        this.isUse = isUse;
    }
}

module.exports = Cell;