import { Employee } from "../Models/Employee";

export const results: string[] = [];

const tipCSVHeaders = [
    'StoreNumber',
    'DateOfTip',
    'TipHour',
    'TimeOfTip',
    'TransNumber',
    'WorkingEmployees',
    'EmployeeSplit',
    'TipAmount',
    'HourlyTotalTips',
    'DailyTotalTips'
];

export const options = {
    skipLines: 4,
    headers: tipCSVHeaders
}


export const employeesFullList: Employee[] = [];

export function getFullEmployeeListName(): string[] {

    let temp: string[] = [];

    employeesFullList.forEach(e => temp.push(e.name));

    return temp;
}

export function enrollEmployee(list: string): void {
    let employees: string[];
    try {

        employees = list.split(/[|]/);

    } catch(e) {

        employees = [];
    }

    employees.forEach(e => {

        if(!(getFullEmployeeListName().includes(e.trim()))) {
            employeesFullList.push(new Employee(e.trim()));
        }
    })

}

export function reAddTip(employeeName: string, transNumber: string)
{
    employeesFullList.forEach(e => {
        if(e.name === employeeName)
        {
            let index: number = 0;

            e.tipsRemoved.tips.forEach(tip => {
                if(tip.transactionNum === parseInt(transNumber))
                {
                    e.addTip(tip);

                    e.removeTip(tip, undefined, true);
                    console.log(e);
                }
            })

            console.log(e.tipsRemoved.employeesDistributedTo);

            e.tipsRemoved.employeesDistributedTo.forEach(e =>{

                e.forEach( employee => {
                    employee.tips.forEach(tip => {
                        if(tip.transactionNum.toString().length > 6)
                        {
                            employee.removeTip(tip);
                        }
                    })
                })
                e.pop();
            })
        }
    })
}

export function addRawTip(listOfEmployees: string, tipAmount: string, transNumber: string, dateTime: string): void {
    if((listOfEmployees || tipAmount || transNumber) === undefined) {
        return;
    }

    let employees: string[];

    let totalTip = parseFloat(tipAmount.split(/[$]/)[1]);

    let transactionNumber = parseInt(transNumber);

    try {
        employees = listOfEmployees.split(/[|]/);

    } catch(e) {
        employees = [];
    }

    employees = employees.map(e => e.trim());

    let tipPerEmployee = Math.round(((totalTip / employees.length) + Number.EPSILON) * 100) / 100;

    employees.forEach(e => {

        if(getFullEmployeeListName().includes(e.trim())) {
            employeesFullList[getFullEmployeeListName().indexOf(e)]
                .addTip(undefined, transactionNumber, tipPerEmployee, dateTime);
        }
    })
}

export function removeAndDistribute (employee: string, transNumber: string): void
{
    let tipAmount: number = 0;
    let employeesToDistribute: Employee[] = [];
    let employeeDeletedFrom: Employee = new Employee('');

    employeesFullList.forEach(e => {
        if(e.name === employee)
        {
            e.tips.forEach(tip => {

                if(tip.transactionNum === parseInt(transNumber))
                {
                    tipAmount = tip.tipAmount;
                    employeeDeletedFrom  = e;
                    e.removeTip(tip);
                    // e.removeTip(undefined,tip.transactionNum);
                }
            })
        }

        e.tips.forEach(tip => {
            if(tip.transactionNum === parseInt(transNumber) && e.name != employee)
            {
                employeesToDistribute.push(e);

            }
        })
    })

    employeesFullList[employeesFullList.indexOf(employeeDeletedFrom)].tipsRemoved.employeesDistributedTo.push(employeesToDistribute);

    tipAmount = Math.round(((tipAmount / employeesToDistribute.length) + Number.EPSILON) * 100) / 100

    employeesToDistribute.forEach(e => e.addTip(undefined,parseInt(transNumber) + 0.2,tipAmount,undefined))

}
