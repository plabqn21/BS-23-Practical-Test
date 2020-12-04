$(document).ready(function () {
 

   
});


window.rootPath = GetRootPath();

function GetRootPath() {
    var scripts = document.getElementsByTagName('script');
    var path = scripts[scripts.length - 1].src.split('?')[0];
    path = path.split('/').slice(0, -2).join('/');
    return path.replace('PageScript', '');
}



function SmartUIMaker(formId) {
    // Get all the inputs into an array...
    var $inputs = $('#' + formId + ' :input').not(':button,submit,reset');


    for (var i = 0; i < $inputs.length-1; i++) {

        var id = $inputs[i].id;
        var value;
        var type = document.getElementById(id).type;
        var name = $('#' + id).attr('name');

        if (type == "select-one") {
            $("#" + id).select2(); // Searchable Dropdown

        }
        else if (type == "text") {

        }
        if (name) {
            if (name.toLowerCase() == "date") {
                LoadCalender(id); //Id of Text Box
            }
        }


    }






};


//Region Server Interaction start
function BindFieldData(url, formId) {
    showLoading();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url,
        success: function (response) {

            var saveButton = $('[name="Save-Button"]'); 
            saveButton.prop('value', 'Update');
            saveButton.addClass("btn btn-warning btn-sm");
            setFormData(formId, response);
           
        },
        error: function (xhr, status, error) {
            $.unblockUI();
            alert("error");
        }
    });
}
function BindFieldDataWithChild(url, formId, Tabulatortable) {
    CleanFormData(formId);
    Tabulatortable.setData([]);
    showLoading();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url,
        success: function (response) {

            var saveButton = $('[name="Save-Button"]');
            saveButton.prop('value', 'Update');
            saveButton.addClass("btn btn-warning btn-sm");
            var saveButton = $('[name="Print-Button"]').prop('disabled', false);
            Tabulatortable.setData(response.Item2);
            setFormData(formId, response.Item1);
            
        },
        error: function (xhr, status, error) {
            $.unblockUI();
            alert("error");
        }
    });
};
function SaveFormData(formId, IndexURL, IsHaveChild) {
    showLoading();
    // Get all the inputs into an array...
    var $inputs = $('#' + formId + ' :input').not(':button,submit,reset');

    var data = {}; // empty 

    for (var i = 0; i < $inputs.length - 1; i++) {

        var id = $inputs[i].id;
        if (id != "") {
        var value;
        var type = document.getElementById(id).type;
        var name = document.getElementById(id).name;

        if (type == "text" && name.toLowerCase() == "date") {
            var date = $('#' + id).val().split("-");
            if (date.length > 1) {

                value = new Date(date[2] + "-" + date[1] + "-" + date[0]);
            }
            else {
                value = null;
            }
        }

        else if (type == "text" || type == "hidden" || type == "textarea" || type == "select-one" || type == "email" || type == "password") {
            value = $('#' + id).val();
        }
        else if (type == "radio") {

            var name = $('#' + id)[0].name;
            var CheckedId = $('input[type=radio][name=' + name + ']:checked').attr('id')
            if (CheckedId == id) {
                value = true;
            }
            else { value = false; }
        }
        else if (type == "checkbox") {
            if ($('#' + id).prop("checked") == true) {
                value = true;
            }
            else { value = false; }
        }
        else if (type == "number") {
            var number = $('#' + id).val();
            if (number != "") {
                value = parseFloat(number)
            }
            else {
                value = 0;
            }
        }


        data[id] = value;

    }
}
    if (!IsHaveChild == true) {
        PostDataToServer(IndexURL, data);
    }
    else {
       
        return data;
    }
}

function SaveFormDataWithChild(formId, childData, IndexURL, SingleDataLoadurl, Tabulatortable) {
  var masterData= SaveFormData(formId, IndexURL, true);
    var data = {
        "entity": masterData,
        "entityChild": childData
    };
    PostDataToServerWithChild(IndexURL, data, SingleDataLoadurl, Tabulatortable, formId)
}
function PostDataToServerWithChild(IndexURL, data, SingleDataLoadurl, Tabulatortable, formId) {

    $.ajax({
        url: IndexURL,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $.unblockUI();
            if (response[0] == "true" || response[0] == "True" || response[0] == true) {

                SavedSuccessfullyPopUp();
                if (SingleDataLoadurl != "") {
                    SingleDataLoadurl = SingleDataLoadurl + response[1];
                    BindFieldDataWithChild(SingleDataLoadurl, formId, Tabulatortable);
                }
                else { location.reload();}
            }
            else if (response[0] == "false" || response[0] == "False" || response[0] == false) {

                ErrormsgPopUp(response[1]);

            }
            else {

                ErrormsgPopUp(response);
            }


        },
        error: function () {
            $.unblockUI();
            ErrormsgPopUp("Somethins went wrong.")

        }
    });


}
function PostDataToServer(IndexURL, data) {

    $.ajax({
        url: IndexURL,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $.unblockUI();
            if (response == "true" || response == "True" || response == true) {
               
                SavedSuccessfullyPopUp();
                location.reload();
            }
            else if (response == "false" || response == "False" || response == false) {
               
                ErrormsgPopUp("Somethins went wrong.");

            }
            else {
               
                ErrormsgPopUp(response);
            }
            
            
        },
        error: function () {
            $.unblockUI();
            ErrormsgPopUp("Somethins went wrong.")
            
        }
    });


}
function DeleteData(deleteurl, id) {

    Swal.fire({

        text: "Are you sure?",
        type: 'warning',
        width: '300px',
        height: '100px',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6' ,
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            showLoading();
            //Here to call ajax to delete data
            $.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: deleteurl + id,
                success: function (data) {
                    $.unblockUI();
                    if (data == true || data == "true" || data == "True" || data == "Sucessful") {
                        Swal.fire({
                            title: 'Data Deleted Successfully.',
                            animation: false,
                            customClass: {
                                popup: 'animated tada'
                            },
                            type: 'success',
                            title: 'Data Deleted Successfully.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        location.reload();
                    }
                    else {
                        ErrormsgPopUp(data);
                    }
                },
                error: function (data) {
                    $.unblockUI();
                    ErrormsgPopUp("Something went wrong.");
                    setTimeout(function () { location.reload(); }, 5000);
                }
            });
        }
    })

}
//Region Server Interaction End

function genericFormValidator(formId, fieldForValidation, fieldForValidationMsg) {
    var $inputs = $('#' + formId + ' :input').not(':button,submit,reset');
    var msg = "Required: ";
    for (var i = 0; i < fieldForValidation.length; i++) {
        var id = $inputs[i].id;
        var type = document.getElementById(id).type;
        if (type == "checkbox") {
            if ($('#' + id).prop("checked") != true) {
                if (i != fieldForValidation.length - 1) {
                    msg = msg + " " + fieldForValidationMsg[i] + ",";
                }
                else {
                    msg = msg + " " + fieldForValidationMsg[i] + ".";
                }


            }

        }
        else {

            if ($('#' + fieldForValidation[i]).val() == "" || $('#' + fieldForValidation[i]).val() == null) {
                if (i != fieldForValidation.length - 1) {
                    msg = msg + " " + fieldForValidationMsg[i] + ",";
                }
                else {
                    msg = msg + " " + fieldForValidationMsg[i] + ".";
                }

            }
        }


    }
    if (msg.length == 10) { return true; }
    else {
        ErrormsgPopUp(msg);
        return false;
    }

};

//Region PopUp start
function SavedSuccessfullyPopUp() {

    Swal.fire({

        animation: false,
        customClass: {
            popup: 'animated tada'
        },
        type: 'success',
        title: 'Successfully Saved Data.',
        showConfirmButton: false,
        timer: 1500
    })

}

function ErrormsgPopUp(msg) {

    Swal.fire({
        type: 'error',
        text: msg,
        timer: 100000
    })

};

function LoadCalender(Id) {
    $('#' + Id).datepicker({
        dateFormat: 'dd-mm-yy', duration: "fast",
        showAnim: "drop",
        changeMonth: true,
        changeYear: true,
        showOptions: { direction: "right" }
    });


};
//Region PopUp End

function CustomSuccessfulMessage(title,message) {
    Swal.fire({      
        customClass: {
            popup: 'animated tada'
        },
        title: title,
        type: 'success',
        text: message,
        showConfirmButton: true,
        
    })
}


function showLoading() {

    $.blockUI({
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#3f729b',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',           
            color: '#ffffff'
        }
    }); 
     
};

function LoadQueryDataFromCommonServiceController(DataLoadurl) {
    showLoading();
    $.getJSON(DataLoadurl,
        function (data) {
            $.unblockUI();
            return data;

        });
    $.unblockUI();
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function setFormData(formId, response) {
    // Get all the inputs into an array...
    var $inputs = $('#' + formId + ' :input').not(':button,submit,reset');

    var data = {}; // empty 

    for (var i = 0; i < $inputs.length - 1; i++) {

        var id = $inputs[i].id;
        var value;
        if (id != "") {
        var type = document.getElementById(id).type;
        var name = document.getElementById(id).name;


        if (type == "text" && name.toLowerCase() == "date") {
            if (response[id] != "" && response[id] != null && response[id] != undefined && response[id].length != undefined) {
                var date = response[id];
                var dateArray = date.split("-");
                var UIDate = dateArray[2].substring(0, 2) + "-" + dateArray[1] + "-" + dateArray[0];
                $('#' + id).val(UIDate).trigger("change");
            }
            else { $('#' + id).val(""); }
        }
        else if (type == "text" || type == "hidden" || type == "textarea" || type == "select-one" || type == "email" || type == "password" || type == "number") {
            $('#' + id).val(response[id]).trigger("change");
        }
        else if ((type == "radio" || type == "checkbox") && response[id] == true) {
            $("#" + id).prop("checked", true).trigger("change");
        }
        else if ((type == "radio" || type == "checkbox") && response[id] == false) {
            $("#" + id).prop("checked", false).trigger("change");
        }
    }
}
    $.unblockUI();
}

function CleanFormData(formId) {
    // Get all the inputs into an array...
    var $inputs = $('#' + formId + ' :input').not(':button,submit,reset');

    for (var i = 0; i < $inputs.length - 1; i++) {

        var id = $inputs[i].id;
        var value;
        if (id != "") {
            var type = document.getElementById(id).type;
            var name = document.getElementById(id).name;


            if (type == "text" && name.toLowerCase() == "date") {
                                   
                    $('#' + id).val("");
               
            }
            else if (type == "text" || type == "hidden" || type == "textarea" || type == "select-one" || type == "email" || type == "password" || type == "number") {
                $('#' + id).val("");
            }
            else if ((type == "radio" || type == "checkbox")) {
                $("#" + id).prop("checked", false);
            }
           
        }
    }
   
}

function GetSQLDate(date) {
    var sqlDate='';
 
        var SplitList = date.split('-');
         sqlDate = SplitList[2] + '-' + SplitList[1] + '-' + SplitList[0];
    
    return sqlDate; 
}