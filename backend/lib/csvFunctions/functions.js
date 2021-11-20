"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAndDistribute = exports.addRawTip = exports.reAddTip = exports.enrollEmployee = exports.getFullEmployeeListName = exports.employeesFullList = exports.options = exports.results = void 0;
const Employee_1 = require("../Models/Employee");
exports.results = [];
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
exports.options = {
    skipLines: 4,
    headers: tipCSVHeaders
};
exports.employeesFullList = [];
function getFullEmployeeListName() {
    let temp = [];
    exports.employeesFullList.forEach(e => temp.push(e.name));
    return temp;
}
exports.getFullEmployeeListName = getFullEmployeeListName;
function enrollEmployee(list) {
    let employees;
    try {
        employees = list.split(/[|]/);
    }
    catch (e) {
        employees = [];
    }
    employees.forEach(e => {
        if (!(getFullEmployeeListName().includes(e.trim()))) {
            exports.employeesFullList.push(new Employee_1.Employee(e.trim()));
        }
    });
}
exports.enrollEmployee = enrollEmployee;
function reAddTip(employeeName, transNumber) {
    exports.employeesFullList.forEach(e => {
        if (e.name === employeeName) {
            let index = 0;
            e.tipsRemoved.tips.forEach(tip => {
                if (tip.transactionNum === parseInt(transNumber)) {
                    e.addTip(tip);
                    e.removeTip(tip, undefined, true);
                    console.log(e);
                }
            });
            console.log(e.tipsRemoved.employeesDistributedTo);
            e.tipsRemoved.employeesDistributedTo.forEach(e => {
                e.forEach(employee => {
                    employee.tips.forEach(tip => {
                        if (tip.transactionNum.toString().length > 6) {
                            employee.removeTip(tip);
                        }
                    });
                });
                e.pop();
            });
        }
    });
}
exports.reAddTip = reAddTip;
function addRawTip(listOfEmployees, tipAmount, transNumber, dateTime) {
    if ((listOfEmployees || tipAmount || transNumber) === undefined) {
        return;
    }
    let employees;
    let totalTip = parseFloat(tipAmount.split(/[$]/)[1]);
    let transactionNumber = parseInt(transNumber);
    try {
        employees = listOfEmployees.split(/[|]/);
    }
    catch (e) {
        employees = [];
    }
    employees = employees.map(e => e.trim());
    let tipPerEmployee = Math.round(((totalTip / employees.length) + Number.EPSILON) * 100) / 100;
    employees.forEach(e => {
        if (getFullEmployeeListName().includes(e.trim())) {
            exports.employeesFullList[getFullEmployeeListName().indexOf(e)]
                .addTip(undefined, transactionNumber, tipPerEmployee, dateTime);
        }
    });
}
exports.addRawTip = addRawTip;
function removeAndDistribute(employee, transNumber) {
    let tipAmount = 0;
    let employeesToDistribute = [];
    let employeeDeletedFrom = new Employee_1.Employee('');
    exports.employeesFullList.forEach(e => {
        if (e.name === employee) {
            e.tips.forEach(tip => {
                if (tip.transactionNum === parseInt(transNumber)) {
                    tipAmount = tip.tipAmount;
                    employeeDeletedFrom = e;
                    e.removeTip(tip);
                    // e.removeTip(undefined,tip.transactionNum);
                }
            });
        }
        e.tips.forEach(tip => {
            if (tip.transactionNum === parseInt(transNumber) && e.name != employee) {
                employeesToDistribute.push(e);
            }
        });
    });
    exports.employeesFullList[exports.employeesFullList.indexOf(employeeDeletedFrom)].tipsRemoved.employeesDistributedTo.push(employeesToDistribute);
    tipAmount = Math.round(((tipAmount / employeesToDistribute.length) + Number.EPSILON) * 100) / 100;
    employeesToDistribute.forEach(e => e.addTip(undefined, parseInt(transNumber) + 0.2, tipAmount, undefined));
}
exports.removeAndDistribute = removeAndDistribute;
