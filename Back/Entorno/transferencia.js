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
     * @param {any} ret
     */
    constructor(ret) {
        super('Return');
        this.ret = ret;
    }
}