var formId = "frmCustomRole";
var table = "tblCustomRole"
var TableDataLoadurl = window.rootPath + "/Account/GetRoleTableData";
var IndexURL = window.rootPath + "/Account/CreateRole";
var DeleteURL = window.rootPath + "/Account/DeleteRole/";
var SingleDataLoadurl = window.rootPath + '/Account/GetSingleRole/'

$(document).ready(function () {

    LoadTableDataFromServer(table, TableDataLoadurl);

    $("#btnSaveCustomRole").click(function () {
        var response = ValidateFormData(formId);
        if (response) {
            SaveFormData(formId, IndexURL);
        }

    });

    $("#btnDeleteCustomRole").click(function () {
        var deleteDataId = $('#Id').val();
        if (deleteDataId == "" || deleteDataId == null) {
            ErrormsgPopUp("Load Data First.");
        }
        else {
            DeleteData(DeleteURL, deleteDataId);
        }

    });

    $("#btnRefreshCustomRole").click(function () {

        location.reload();
    });

    SmartUIMaker(formId);
});
function ValidateFormData(formId) {
    var fieldForValidation = [];
    var fieldForValidationMsg = [];
    fieldForValidation.push("RoleName"); //id of text box
    fieldForValidationMsg.push("Role Name");  
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
        height: "300px",
        layout: "fitColumns",
        printAsHtml: true,
        printHeader: "<h1>Role List<h1>",
        printFooter: "<h4>Powred by Dhokani<h4>",
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [20, 40, 70, 100],
        movableColumns: true,
        columns: [
            { title: "Id", field: "Id", visible: false },
            { title: "Role Name", field: "RoleName", align: "center", headerFilter: "input"},
           
        ],
        rowClick: function (e, row) {

            var url = SingleDataLoadurl + row._row.data.Id;
            BindFieldData(url, formId)
           
        },

    });

 

}

// #endregion Tabulator End
;