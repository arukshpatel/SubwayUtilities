"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateCSV = exports.tableFormat = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const main = __importStar(require("./csvFunctions/functions"));
function tableFormat(name, transNum, tipAmount, dateTime) {
    let tdName = "<td>" + name + "</td>\n";
    let tdDate = "<td>" + dateTime + "</td>\n";
    let tdTransNum = "<td>" + transNum + "</td>\n";
    let tdTipAmount = "<td>" + tipAmount + "</td>\n";
    let checkbox = "<input type = \"checkbox\" id=\"" + name + transNum + "\" name=\"" + name + "\" value=\"" + name + "\" onclick=\"removeOrAdd(this.name, this.value)\" >\n";
    return ("<tr>\n" + tdName + tdDate + tdTransNum + tdTipAmount + checkbox + "</tr>\n");
}
exports.tableFormat = tableFormat;
function initiateCSV(pathToCSV) {
    fs_1.default.createReadStream(pathToCSV)
        .pipe((0, csv_parser_1.default)(main.options))
        .on('data', (data) => {
        main.results.push(data);
        main.enrollEmployee(data.WorkingEmployees);
        main.addRawTip(data.WorkingEmployees, data.TipAmount, data.TransNumber, (data.DateOfTip + " - " + data.TimeOfTip));
    })
        .on('end', () => {
        main.employeesFullList.forEach(e => console.log(e.name + "\n\t" + e.totalTip()));
        main.removeAndDistribute('CHRISTIAN, JANET', '394795');
        console.log("-------------------------------------------------------------------");
        main.employeesFullList.forEach(e => {
            console.log(e.name + "\n\t" + e.totalTip());
        });
        main.reAddTip('CHRISTIAN, JANET', '394795');
        console.log("-------------------------------------------------------------------");
        main.employeesFullList.forEach(e => console.log(e.name + "\n\t" + e.totalTip()));
        // main.employeesFullList.forEach(e => {
        //     e.tips.forEach(tip => {
        //         console.log(tableFormat(e.name, tip.transactionNum, tip.tipAmount, tip.dateTime || "null"));
        //     })
        // })
    });
}
exports.initiateCSV = initiateCSV;
initiateCSV("./CSV/TipsSummaryReportOrg.csv");
