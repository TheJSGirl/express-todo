'use strict'
$(document).ready(()=>{

    $('.delete-todo').on('click', (e) => {
        e.preventDefault();

        const $target = $(e.target);

        const id = $target.attr('data-id');
        console.log(id);

        myajax('delete', '/todos/delete/'+id, null, ()=>{
            console.log('todo deleting');
            window.location.href='/';
        }, ()=>{
            return console.log('failed to get todo_id');
        }, null);
    });
});
    
function myajax(reqType, reqUrl, data,  success, errFunction, reqCompleteFunction){
    $.ajax({
        type: reqType,
        url : reqUrl,
        success : success,
        error : errFunction,
        complete : reqCompleteFunction,
        statusCode: {
            404 : () => {
                return alert('page not found');
            },
            422 : () =>{
                return alert('wrong parameters');
            }
        }
    });
};
