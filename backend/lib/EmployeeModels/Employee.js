"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const Tip_1 = require("./Tip");
class Employee {
    constructor(name, tip, transactionNumber, tipAmount, dateTime) {
        this.tips = [];
        this.tipsRemoved = { employeesDistributedTo: [[]], tips: [] };
        this.name = name;
        if (tip) {
            this.addTip(tip);
        }
        if (transactionNumber && tipAmount && (!tip)) {
            let temp = new Tip_1.Tip(transactionNumber, tipAmount, dateTime);
            this.addTip(temp);
        }
    }
    addTip(tip, transactionNumber, tipAmount, dateTime) {
        if (tip) {
            if (this.tipsRemoved.tips.includes(tip)) {
                this.tipsRemoved.tips.forEach(removedTip => {
                    if (removedTip === tip) {
                        this.tips.push(removedTip);
                        this.removeTip(removedTip, undefined, true);
                    }
                });
            }
            else {
                this.tips.push(tip);
            }
        }
        if (!tip && transactionNumber && tipAmount) {
            let temp = new Tip_1.Tip(transactionNumber, tipAmount, dateTime);
            this.tips.push(temp);
            return;
        }
    }
    removeTip(tipToBeRemoved, transactionNumber, fromRemovedTips) {
        if (fromRemovedTips) {
            this.tipsRemoved.tips.forEach(removedTip => {
                if (removedTip === tipToBeRemoved) {
                    this.tipsRemoved.tips.splice(this.tipsRemoved.tips.indexOf(removedTip), 1);
                }
            });
            return;
        }
        if (tipToBeRemoved) {
            let index = this.tips.indexOf(tipToBeRemoved);
            if (index > -1) {
                this.tipsRemoved.tips.push(tipToBeRemoved);
                this.tips.splice(index, 1);
            }
        }
        if (tipToBeRemoved === undefined && transactionNumber) {
            let index = 0;
            this.tips.forEach(tip => {
                if (tip.transactionNum === transactionNumber) {
                    this.tipsRemoved.tips.push(tip);
                    this.tips.splice(this.tips.indexOf(tip), 1);
                    return;
                }
                index++;
            });
        }
    }
    totalTip() {
        let sum = 0;
        this.tips.forEach(tip => sum += tip.tipAmount);
        return Math.round(sum * 100) / 100;
    }
    totalRemovedTip() {
        let sum = 0;
        this.tipsRemoved.tips.forEach(tip => sum += tip.tipAmount);
        return Math.round(sum * 100) / 100;
    }
}
exports.Employee = Employee;
