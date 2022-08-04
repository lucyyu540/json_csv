const rowDelim = '\r\n';
const delim = '\t';

const fileSelectorJson = document.getElementById('json');
fileSelectorJson.addEventListener('change', async (event) => {
    const json = await parseJsonFile(event.target.files[0]);
    JSONToExcelConverter(json, "RT_Mobile_Language");

});
async function parseJsonFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(JSON.parse(event.target.result))
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
    })
}
const JSONToCSVConverter = (json, ReportTitle) => {
    var CSV = 'sep=' + delim + rowDelim;
    CSV += 'variables' + delim;

    var totalRows = 0;
    //first row
    for (lang in json) {
        //skip
        if (lang.charAt(0) == '_') {
            continue;
        }
        //add language column
        CSV += lang + delim;
        console.log(lang);

        if (totalRows == 0) {
            totalRows = Object.keys(json[lang]).length;
            console.log('total rows: ' + totalRows);
        }
    }
    //next row 
    CSV += rowDelim;

    //the rest of the rows
    for (let i = 0; i < totalRows; i++) {
        let first = true;
        for (lang in json) {
            //skip
            if (lang.charAt(0) == '_') {
                continue;
            }

            const key = Object.keys(json[lang])[i];
            //skip
            if (key.charAt(0) == '_') {
                continue;
            }
            if (first) {
                //add variable name as column
                CSV += key + delim;
                first = false;
            }
            //add value as column
            CSV += json[lang][key] + delim;
        }

        //next row
        CSV += rowDelim;
    }


    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //this will remove the blank-spaces from the title and replace it with an underscore
    var fileName = ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
const JSONToExcelConverter = (json, ReportTitle) => {
    const data = [];
    let currentRow = [];

    var totalRows = 0;
    //first row
    currentRow.push('variables');
    for (lang in json) {
        //skip
        if (lang.charAt(0) == '_') {
            continue;
        }
        //add language column
        currentRow.push(lang);

        if (totalRows == 0) {
            totalRows = Object.keys(json[lang]).length;
        }
    }
    data.push(currentRow);

    //the rest of the rows
    for (let i = 0; i < totalRows; i++) {
        currentRow = [];
        for (lang in json) {
            //skip
            if (lang.charAt(0) == '_') {
                continue;
            }

            const key = Object.keys(json[lang])[i];
            //skip
            if (key.charAt(0) == '_') {
                continue;
            }
            if (currentRow.length === 0) {
                //add variable name as column
                currentRow.push(key);
            }
            //add value as column
            currentRow.push(json[lang][key]);
        }

        //next row
        data.push(currentRow);
    }


    var workbook = XLSX.utils.book_new(),
        worksheet = XLSX.utils.aoa_to_sheet(data);
    workbook.SheetNames.push("Sheet1");
    workbook.Sheets["Sheet1"] = worksheet;
    // (C3) TO BINARY STRING
    var xlsbin = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "binary"
    });

    // (C4) TO BLOB OBJECT
    var buffer = new ArrayBuffer(xlsbin.length),
        array = new Uint8Array(buffer);
    for (var i = 0; i < xlsbin.length; i++) {
        array[i] = xlsbin.charCodeAt(i) & 0XFF;
    }
    var xlsblob = new Blob([buffer], { type: "application/octet-stream" });
    delete array; delete buffer; delete xlsbin;

    // (C5) "FORCE DOWNLOAD"
    var url = window.URL.createObjectURL(xlsblob),
        anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = ReportTitle + ".xlsx";
    anchor.click();
    window.URL.revokeObjectURL(url);
    delete anchor;

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fileSelectorText = document.getElementById('txt');
fileSelectorText.addEventListener('change', async (event) => {
    const excel = await parseTextFile(event.target.files[0]);
    TextToJSONConverter(excel, "language");
});
async function parseTextFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(event.target.result);
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
    })
}
const TextToJSONConverter = (csv, title) => {
    if (!csv) {
        alert("Invalid csv file!");
        return;
    }
    const rows = csv.split(rowDelim);
    if (rows.length < 2) {
        alert("Invalid csv file!");
        return;
    }

    const json = {};
    //second row = language mode names
    const langArr = rows[0].split(delim);
    for (let col = 1; col < langArr.length; col++) {
        //make objects
        const lang = langArr[col];
        console.log(lang);
        if (lang) {
            json[lang] = {};
        }
    }

    for (let row = 1; row < rows.length; row++) {
        const columns = rows[row].split(delim);
        const row_var_name = columns[0];
        console.log(columns);
        for (let col = 1; col < columns.length; col++) {
            const lang = langArr[col];
            if (lang) {
                json[lang][row_var_name] = columns[col];
            }
        }
    }

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(JSON.stringify(json));

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = title + ".json";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fileSelectorExcel = document.getElementById('excel');
fileSelectorExcel.addEventListener('change', async (event) => {
    const excel = await parseExcelFile(event.target.files[0]);
    ExcelToJSONConverter(excel, "language");
});
async function parseExcelFile(file) {
    //[{"variables":"f_date_db","en":"YYYYMMDD","ko":"YYYYMMDD","ko2":"YYYYMMDD"},
    const excel = [];
    return new Promise((resolve, reject) => {
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
    
            workbook.SheetNames.forEach(function (sheetName) {
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                excel.push(XL_row_object);
                // var json_object = JSON.stringify(XL_row_object);
                // console.log(json_object);
            })    
        };
    
        reader.onerror = function (ex) {
            console.log(ex);
            reject();
        };
    
        reader.readAsBinaryString(file);
        reader.onloadend = function() {
            resolve(excel);
        }
    })
   
}
const ExcelToJSONConverter = (excel, title) => {
    if(!excel) 
    {
        alert('invalid excel file!');
    }
    if(excel.length < 1) 
    {
        alert('invalid excel file!');
    }
    const sheet = excel[0];
    if(sheet.length < 1) 
    {
        alert('invalid excel file!');
    }
    const json = {};

    //init languages
    for(lang in sheet[0]) 
    {
        
        if(lang === 'variables') 
        {
            continue;
        }
        console.log(lang);
        json[lang] = {};
    }

    //fill in variables
    for (let i = 0 ; i < sheet.length; i ++) 
    {
        const varName = sheet[i].variables;
        for (lang in json) 
        {
            json[lang][varName] = sheet[i][lang];
        }
    }


    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(JSON.stringify(json));

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = title + ".json";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}





