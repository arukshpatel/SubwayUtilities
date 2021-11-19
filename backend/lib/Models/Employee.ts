import { Tip } from "./Tip";

export class Employee
{
    name: string;
    tips: Tip[] = [];

    tipsRemoved: { employeesDistributedTo: Employee[][]; tips: Tip[]} = {employeesDistributedTo: [[]], tips: []} ;

    constructor(name: string, tip?: Tip, transactionNumber?: number, tipAmount?: number, dateTime?: string) {
        this.name = name;
        if(tip) {
            this.addTip(tip);
        }

        if(transactionNumber && tipAmount && (!tip)) {
            let temp = new Tip(transactionNumber, tipAmount, dateTime);
            this.addTip(temp);

        }
    }


    addTip(tip?: Tip, transactionNumber?: number, tipAmount?: number, dateTime?: string): void {
        if(tip) {

            if(this.tipsRemoved.tips.includes(tip))
            {
                this.tipsRemoved.tips.forEach(removedTip => {
                    if(removedTip === tip)
                    {
                        this.tips.push(removedTip);
                        this.removeTip(removedTip, undefined, true);
                    }
                })
            } else
            {
                this.tips.push(tip);
            }
        }

        if(!tip && transactionNumber && tipAmount) {

            let temp = new Tip(transactionNumber, tipAmount, dateTime)
            this.tips.push(temp);
            return;
        }
    }

    removeTip(tipToBeRemoved?: Tip, transactionNumber?: number, fromRemovedTips?: boolean): void
    {

        if(fromRemovedTips)
        {
            this.tipsRemoved.tips.forEach(removedTip =>
            {
                if (removedTip === tipToBeRemoved)
                {
                    this.tipsRemoved.tips.splice(this.tipsRemoved.tips.indexOf(removedTip), 1);
                }
            })

            return;
        }

        if(tipToBeRemoved)
        {
            let index = this.tips.indexOf(tipToBeRemoved);

            if(index > -1)
            {
                this.tipsRemoved.tips.push(tipToBeRemoved);
                this.tips.splice(index, 1);
            }

        }

        if(tipToBeRemoved === undefined && transactionNumber)
        {
            let index = 0;

            this.tips.forEach(tip => {
                if(tip.transactionNum === transactionNumber)
                {
                    this.tipsRemoved.tips.push(tip);
                    this.tips.splice(this.tips.indexOf(tip), 1);
                    return;
                }
                index++;
            });
        }
    }


    totalTip(): number {
        let sum: number = 0;

        this.tips.forEach(tip => sum += tip.tipAmount);

        return Math.round(sum * 100)/100;
    }

    totalRemovedTip(): number {
        let sum: number = 0;

        this.tipsRemoved.tips.forEach(tip => sum += tip.tipAmount);

        return Math.round(sum * 100)/100;

    }

}