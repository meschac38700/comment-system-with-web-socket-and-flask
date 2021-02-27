let parent_comment = document.querySelector(".new_comment.new_parent_comment");
let children_comment = document.querySelectorAll(".comment_content_footer .new_comment");
// submit form
let submitButton = document.querySelector(".add_comment_btn");
function send(msg)
{
    let $data = {};
    $data['username'] = "John DOE";
    $data['useremail'] = "john.doe@gmail.com";
    $data['usermessage'] = msg;
    //Ajax request
    //var form = new FormData(document.getElementById('login-form'));
    fetch("https://www.eliam-lotonga.fr/sendmail", {
        method: "POST",
        body: {msg: msg}
    })
//    $.ajax({

//        type: "POST",
//        url: "https://www.eliam-lotonga.fr/sendmail",
//        data: $data,
//        success: function (response)
//        {
//            // TODO
//        },
//        error: function(resultat, statut, erreur)
//        {
//            // TODO
//        },
//        dataType: "json"
//    });
   return;
}

children_comment.forEach(child =>{
    child.addEventListener("keyup", (e)=>
    {
        e.preventDefault();
        let msg = child.value.trim();
        if (!((e.ctrlKey  &&  e.keyCode === 13) || (e.shiftKey  &&  e.keyCode === 13)) && e.keyCode === 13) {
            if (msg !== "")
            {
                send(msg);
            }
        }
    });
});

submitButton.click(function (e)
{
    e.preventDefault();
    let name;
    let email;
    let msg = parent_comment.value.trim();
    if (msg !== "")
    {
        send(msg);
    }
})

