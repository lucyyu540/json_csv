
var json;
var excel;

const fileSelectorJson = document.getElementById('json');
fileSelectorJson.addEventListener('change', async (event) => {
    json = await parseJsonFile(event.target.files[0])
    console.log(json);
});  
async function parseJsonFile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = event => resolve(JSON.parse(event.target.result))
      fileReader.onerror = error => reject(error)
      fileReader.readAsText(file)
    })
}
/////////////////////////////////////////////////////////////////

const convertJsonButton = document.getElementById('convert-json');
convertJsonButton.addEventListener('click', async (event) => {
    JSONToCSVConvertor(json, "Lang_Setting");
});  
const JSONToCSVConvertor = (json, ReportTitle) => {
  
    const delim = ',';
    
    var CSV = '';
    CSV += 'variables' + delim;

    var totalRows = 0;
    //first row
    for (lang in json) 
    {
        //skip
        if(lang.charAt(0)== '_') 
        {
            continue;
        }
        //add language column
        CSV += lang + delim;
        console.log(lang);

        if(totalRows == 0) 
        {
            totalRows = Object.keys(json[lang]).length;
            console.log('total rows: ' + totalRows);
        }
    }
    //next row 
    CSV +='\r\n';

    //the rest of the rows
    for (let i = 0 ; i < totalRows; i ++) 
    {
        let first = true;
        for (lang in json) 
        {
            //skip
            if(lang.charAt(0) == '_') 
            {
                continue;
            }

            const key = Object.keys(json[lang])[i];
             //skip
            if(key.charAt(0) == '_') 
            {
                continue;
            }
            if(first)
            {
                 //add variable name as column
                 CSV += key + delim;
                 first = false;
            }
            //add value as column
            CSV += json[lang][key] + delim;
        }

        //next row
        CSV +='\r\n';
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

/////////////////////////////////////////////////////////////////

const fileSelectorExcel = document.getElementById('excel');
fileSelectorExcel.addEventListener('change', async (event) => {
    console.log('excel event lister')
    excel = await parseExcelFile(event.target.files[0])
    console.log(excel);
});   
async function parseExcelFile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary'
        });
  
        workbook.SheetNames.forEach(function(sheetName) {
          // Here is your object
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          var json_object = JSON.stringify(XL_row_object);
          console.log(json_object);
          resolve(json_object);
  
        })
      }
      fileReader.onerror = error => reject(error)
      fileReader.readAsText(file)
      reader.readAsBinaryString(file);

    })
}

  



