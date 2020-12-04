var formId = "frmMasterPost";
var table = "tblMasterPost"
var TableDataLoadurl = window.rootPath + "/MasterPost/GetTableData";
var IndexURL = window.rootPath + "/MasterPost/Index";
var DeleteURL = window.rootPath + "/MasterPost/Delete/";
var SingleDataLoadurl = window.rootPath + '/MasterPost/GetSingleMasterPost/'

$(document).ready(function () {

    LoadTableDataFromServer(table, TableDataLoadurl);

    $("#btnSaveMasterPost").click(function () {
        var response = ValidateFormData(formId);
        if (response) {
            SaveFormData(formId, IndexURL);
        }

    });

    $("#btnDeleteMasterPost").click(function () {
        var deleteDataId = $('#Id').val();
        if (deleteDataId == "" || deleteDataId == null) {
            ErrormsgPopUp("Load Data First.");
        }
        else {
            DeleteData(DeleteURL, deleteDataId);
        }

    });

    $("#btnRefreshMasterPost").click(function () {

        location.reload();
    });

    SmartUIMaker(formId);
});
function ValidateFormData(formId) {
    var fieldForValidation = [];
    var fieldForValidationMsg = [];
    fieldForValidation.push("PostDetails"); //id of text box
    fieldForValidationMsg.push("Post Details");
    

    return response = genericFormValidator(formId, fieldForValidation, fieldForValidationMsg);

}
function LoadTableDataFromServer(table, TableDataLoadurl) {
    $.getJSON(TableDataLoadurl,
        function (tabledata) {

            BindDataToTabular(tabledata, table);

        });
}
// #region Tabulator
function BindDataToTabular(tabledata, table) {

    var table = new Tabulator("#" + table, {
        data: tabledata, //set initial table data
        height: "330px",
        layout: "fitColumns",
        printAsHtml: true,
        printHeader: "<h1>MasterPost List<h1>",     
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [10, 20, 30, 40],
        movableColumns: true,
        columns: [
            { title: "Id", field: "Id", visible: false },
            { title: "Post No", field: "PostNo", headerFilter: "input" },
            { title: "User", field: "Name", headerFilter: "input" },
            { title: "Post Details", field: "PostDetails", headerFilter: "input", width: 500 },
            {
                title: "Date", field: "DateAdded", headerFilter: "input", formatter: "datetime", align: "center", formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD-MM-YYYY",
                    invalidPlaceholder: "---",
                }, width: 120
            },
            { title: "No. <br/>Of Comment", field: "NoOfComment", headerFilter: "input", width: 150},
            

        ],
        rowClick: function (e, row) {

            var url = SingleDataLoadurl + row._row.data.Id;
            BindFieldData(url, formId)
            $("#btnSaveMasterPost").prop('value', 'Update');
            //e - the click event object
            //row - row component
        },

    });

    //trigger download of data.xlsx file
    $("#download-xlsx-MasterPostlist").click(function () {
        table.download("xlsx", "MasterPostlist.xlsx", { sheetName: "MasterPost List Report" });
    });
    //trigger download of data.csv file
    $("#download-csv-MasterPostlist").click(function () {
        table.download("csv", "MasterPostList.csv");
    });

}

// #endregion Tabulator End
;