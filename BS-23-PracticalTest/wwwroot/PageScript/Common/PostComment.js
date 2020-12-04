
var table = "PostTable"

var IndexURL = window.rootPath + "/PostComment/Index";


$(document).ready(function () {


    $("button, input[type=button]").click(function (data) {
        var PostId=
        alert("button click");
    });

    LoadTableDataFromServer();
   
});

function LoadTableDataFromServer(table, TableDataLoadurl) {
    $.getJSON(window.rootPath + "/PostComment/GetTableData",
        function (tabledata) {

            BindDataToTabular(tabledata, table);

        });
}
// #region Tabulator
function BindDataToTabular(tabledata, table) {

    var Post = tabledata.Item1;
    var Comment = tabledata.Item2;

    for (i = 0; i < Post.length; i++) {
        $('#PostTable').append('<tr><td>' + Post[i].PostNo + '</td> <td>' + Post[i].PostDetails + '</td></tr>');
        var PostId = Post[i].Id;
        var CommentList = $.grep(Comment, function (n, i) {
            return n.MasterPostId == PostId ;
        });

        if (CommentList.length > 0) {
            for (j = 0; j < CommentList.length; j++) {
                $('#PostTable').append('<tr><td style="margin-left: 30px;">' + CommentList[j].CommentDetails + '</td> <td>Time: ' + CommentList[j].DateAdded + '</td> <td>' + CommentList[j].CmtLikes + '</td> <td><input type="button" value="Like" id="' + CommentList[j].Id + '" onClick="reply_click_Like(this.id)"><td>' + CommentList[j].CmtDisLikes + '</td> <td><input type="button" value="Dislike" id="' + CommentList[j].Id + '" onClick="reply_click_Dislike(this.id)"></tr>');
            }
        }

        $('#PostTable').append(' <tr><td style="width:400px;" align="right">Comment <td> <input type="text" id="' + Post[i].Id + 'TextBox"/> <input type="button" value="Submit" id="' + Post[i].Id + '" onClick="reply_click(this.id)"> </td></tr>');
       
    }
}

function reply_click(clicked_id) {
    var PostId = clicked_id;
    var Comment = $("#" + clicked_id + "TextBox").val();
    var data = {};
    data.MasterPostId = PostId;
    data.CommentDetails = Comment;
    var url = window.rootPath + "/PostComment/SaveComment";
    $.ajax({
        url: url,
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

function reply_click_Like(clicked_id) { UpdateComment("Like", clicked_id);}
function reply_click_Dislike(clicked_id) { UpdateComment("DisLike", clicked_id); }

function UpdateComment(State, clicked_id) {

    var CommentId = clicked_id;
    
    var data = {};
    data.CommentId = CommentId;
    data.State = State;
    var url = window.rootPath + "/PostComment/UpdateComment";
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $.unblockUI();
            location.reload();

        },
        error: function () {
            $.unblockUI();
            ErrormsgPopUp("Somethins went wrong.")

        }
    });
}