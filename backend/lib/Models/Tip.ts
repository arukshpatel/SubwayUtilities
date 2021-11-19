export class Tip
{
    dateTime: string | undefined;
    transactionNum: number;
    tipAmount: number;

    constructor(transactionNumber: number, tipAmount: number, dateTime?: string) {
        this.dateTime = dateTime;
        this.transactionNum = transactionNumber;
        this.tipAmount = tipAmount;
    }


}