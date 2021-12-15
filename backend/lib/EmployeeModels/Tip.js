"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tip = void 0;
class Tip {
    constructor(transactionNumber, tipAmount, dateTime) {
        this.dateTime = dateTime;
        this.transactionNum = transactionNumber;
        this.tipAmount = tipAmount;
    }
}
exports.Tip = Tip;
