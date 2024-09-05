export class BreakExcp extends Error {
    constructor() {
        super('Break');
    }
}

export class ContinueExcp extends Error {
    constructor() {
        super('Continue');
    }
}

export class ReturnExcp extends Error {
    /**
     * @param {any} value
     */
    constructor(value) {
        super('Return');
        this.value = value;
    }
}