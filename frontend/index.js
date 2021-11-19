// const electron = require('electron');
//
// const {ipcRenderer} = require('electron').ipcRenderer;

const fs = require('fs');
const csv = require('csv-parser');
const main = require('../backend/lib/csvFunctions/functions')

const path = require('path');

const form = document.querySelector('form');

form.addEventListener('submit', submitPath);


function submitPath(e) {
    e.preventDefault();

    let csvFile = document.getElementById("CSVFile").value;
    let csvPath = document.getElementById("CSVPath").value;

    if(csvFile && !csvPath)
    {
        csvFile = csvFile.split(/[\\]/)[2];
    }

    if(!csvFile && csvPath)
    {
        return readCSV(csvPath);
    }

    if(!csvFile && !csvPath)
    {
        return alert("Please enter a valid path");
    }

    if(csvFile && csvPath)
    {
        return alert("Please only use one option");
    }



    let filePath = path.resolve(path.join('CSV/', csvFile));
    document.getElementById("CSVFile").value = null;
    return readCSV(filePath);

}

function readCSV(filePath) {

    fs.createReadStream(filePath)
      .pipe(csv(main.options))
      .on('data', (data) => {
          main.enrollEmployee(data.WorkingEmployees);
          main.addRawTip(data.WorkingEmployees, data.TipAmount, data.TransNumber, (data.DateOfTip + " - " + data.TimeOfTip))

      })
      .on('end', () => {
          let parsedTable;
          let totalTable;
          
          main.employeesFullList.forEach(e => {

              e.tips.forEach(tip => {
                  let temp = parsedDataTableFormat(e.name, tip.transactionNum, tip.tipAmount, tip.dateTime);
                  if(temp !== "undefined")
                  {
                      parsedTable += temp;
                  }
              })

              let temp = totalTableFormat(e.name, e.totalTip());
              if(temp !== "undefined")
              {
                  totalTable += temp;
              }
          })

          document.getElementById("ParsedDataBody").innerHTML = parsedTable;
          document.getElementById("employeeTotalInfoBody").innerHTML = totalTable;
      })
}

function totalTableFormat(name, totalTip)
{
    let tdName = "<td>" + name + "</td>\n";
    let tdTipAmount = "<td>" + totalTip + "</td>\n";

    return ("<tr>\n" + tdName +  tdTipAmount  + "</tr>\n");
}

function parsedDataTableFormat(name, transNum, tipAmount, dateTime)
{
    if((name || transNum || tipAmount) === undefined )
    {
        return;
    }
    let tdName = "<td>" + name + "</td>\n";
    let tdDate = "<td>" + dateTime + "</td>\n";
    let tdTransNum = "<td>" + transNum + "</td>\n";
    let tdTipAmount = "<td>" + tipAmount + "</td>\n";
    let checkbox = "<input type = \"checkbox\" id=\"" + name + transNum + "\" name=\"" + name + "\" value=\"" + transNum + "\" onclick=\"removeOrAdd(this.name, this.value)\" >\n";

    return ("<tr>\n" + tdName + tdDate + tdTransNum + tdTipAmount + "<td>" + checkbox + "</td>" + "</tr>\n");
}

function updateTotalTable()
{
    let totalTable;
    main.employeesFullList.forEach(e => {
        totalTable += totalTableFormat(e.name, e.totalTip());
    });
    document.getElementById("employeeTotalInfoBody").innerHTML = totalTable;
}

function removeOrAdd(name, value)
{
    if(document.getElementById(name+value).checked)
    {
        main.removeAndDistribute(name, value);
        updateTotalTable();
    }

    if(!document.getElementById(name+value).checked)
    {
        main.reAddTip(name, value);
        updateTotalTable();
    }
}