class Cell {
    constructor(coef, value = 0) {
        this.coef = coef;
        this.value = value;
        this.isUse = true;
        this.isUnavailable = false;
        this.sign = "";
    }

    toString(isUnavailableUse = true) {
        if (isUnavailableUse) {
            return this.isUnavailable ? `-${this.sign && ("|" + this.sign)}` : `${this.value}(${this.coef})${this.sign && ("|" + this.sign)}`;
        } else {
            return `${this.value}(${this.coef})${this.sign && ("|" + this.sign)}`;
        }
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