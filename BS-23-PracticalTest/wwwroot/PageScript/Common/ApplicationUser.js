var formId = "frmApplicationUser";
var table = "tblApplicationUser"
var TableDataLoadurl = window.rootPath + "/Account/GetApplicationUserTableData";
var IndexURL = window.rootPath + "/Account/AddUser";
var DeleteURL = window.rootPath + "/Account/DeleteApplicationUser/";
var SingleDataLoadurl = window.rootPath + '/Account/GetSingleApplicationUser/'

$(document).ready(function () {
    $("#NoPasswordUpdateWarning").hide();
    LoadTableDataFromServer(table, TableDataLoadurl);

    $("#btnSaveApplicationUser").click(function () {
        var response = ValidateFormData(formId);
        if (response) {
            SaveFormData(formId, IndexURL);
        }

    });

    $("#btnDeleteApplicationUser").click(function () {
        var deleteDataId = $('#Id').val();
        if (deleteDataId == "" || deleteDataId == null) {
            ErrormsgPopUp("Load Data First.");
        }
        else {
            DeleteData(DeleteURL, deleteDataId);
        }

    });

    $("#btnRefreshApplicationUser").click(function () {

        location.reload();
    });

    //SmartUIMaker(formId);
});
function ValidateFormData(formId) {
    var fieldForValidation = [];
    var fieldForValidationMsg = [];

    fieldForValidation.push("Name"); //id of text box
    fieldForValidationMsg.push("Name"); // Message to show
    fieldForValidation.push("PhoneNumber"); //id of text box
    fieldForValidationMsg.push("Mobile"); // Message to show
    fieldForValidation.push("Email"); //id of text box
    fieldForValidationMsg.push("Email"); // Message to show
   
    fieldForValidation.push("Password"); //id of text box
    fieldForValidationMsg.push("Password"); // Message to show
    fieldForValidation.push("ConfirmPassword"); //id of text box
    fieldForValidationMsg.push("Confirm Password"); // Message to show
    
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
        height: "380px",
        layout: "fitColumns",      
        printAsHtml: true,
        printHeader: "<h1>User List<h1>",
        printFooter: "<h4>Powred by Dhokani<h4>",
        pagination: "local",
        paginationSize: 20,
        paginationSizeSelector: [10, 20, 30, 40],
        movableColumns: true,
        columns: [
            { title: "Id", field: "Id", visible: false },
            { title: "Name", field: "Name", align: "center", headerFilter: "input" ,width:350},
            { title: "User Code", field: "UserName", align: "center", headerFilter: "input", width: 150 },           
            { title: "Email", field: "Email", align: "center", headerFilter: "input", width: 180},
            { title: "Mobile", field: "PhoneNumber", align: "center", headerFilter: "input", width: 120},           
            { title: "Role", field: "Role", align: "center", headerFilter: "input", width: 200},
           
        ],
        initialSort: [
            { column: "UserName", dir: "asc" }, //sort by this first
            
        ],
        rowClick: function (e, row) {

            var url = SingleDataLoadurl + row._row.data.Id;
            BindFieldData(url, formId)           
            $("#NoPasswordUpdateWarning").show();

            //e - the click event object
            //row - row component
        },

    });

 

}

// #endregion Tabulator End
;