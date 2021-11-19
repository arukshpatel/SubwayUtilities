import fs          from "fs";
import csv       from "csv-parser";
import * as main from "./csvFunctions/functions";

export function tableFormat(name: string, transNum: number, tipAmount: number, dateTime: string): string
{
    let tdName = "<td>" + name + "</td>\n";
    let tdDate = "<td>" + dateTime + "</td>\n";
    let tdTransNum = "<td>" + transNum + "</td>\n";
    let tdTipAmount = "<td>" + tipAmount + "</td>\n";
    let checkbox = "<input type = \"checkbox\" id=\"" + name + transNum + "\" name=\"" + name + "\" value=\"" + name + "\" onclick=\"removeOrAdd(this.name, this.value)\" >\n";

    return ("<tr>\n" + tdName + tdDate + tdTransNum + tdTipAmount + checkbox + "</tr>\n");
}

export function initiateCSV(pathToCSV: string)
{
    fs.createReadStream(pathToCSV)
      .pipe(csv(main.options))
      .on('data', (data: any) => {
          main.results.push(data);
          main.enrollEmployee(data.WorkingEmployees);
          main.addRawTip(data.WorkingEmployees, data.TipAmount, data.TransNumber, (data.DateOfTip + " - " + data.TimeOfTip));

      })
      .on('end', () => {

          main.employeesFullList.forEach(e => console.log(e.name + "\n\t" + e.totalTip()));

          main.removeAndDistribute('CHRISTIAN, JANET', '394795');

          console.log("-------------------------------------------------------------------")

          main.employeesFullList.forEach(e => {

              console.log(e.name + "\n\t" + e.totalTip());
          });

          main.reAddTip('CHRISTIAN, JANET', '394795');
          console.log("-------------------------------------------------------------------")
          main.employeesFullList.forEach(e => console.log(e.name + "\n\t" + e.totalTip()));
          // main.employeesFullList.forEach(e => {
          //     e.tips.forEach(tip => {
          //         console.log(tableFormat(e.name, tip.transactionNum, tip.tipAmount, tip.dateTime || "null"));
          //     })
          // })


      });
}

initiateCSV("./CSV/TipsSummaryReportOrg.csv");