$(document).ready(function($){
    //Global jQuery variables settings
    $form = $('#task_form');
    $input = $('#task_input');
    $btnsubmit = $('#btnsubmit');
    $list = $('#task_list');
    $finishedlist = $('#finished_task_list');
    $clearfinished = $('#task_clear');
    //Global javascript variables
    todoKey = [];
    movedKey = [];
    if (localStorage['todoKey']!=null){
        todoKey = JSON.parse(localStorage['todoKey']);
    }
    if (localStorage['movedKey']!=null){
        movedKey = JSON.parse(localStorage['movedKey']);
    }
    updateList($list,todoKey);
    updateList($finishedlist,movedKey);
    $input.focus();
    $input.submit(addItem);
    $btnsubmit.click(addItem);
    $clearfinished.click(clearFinished);
});
function addItem(){
    val = $input.val();
    if (val === '') {
        $('.error').text('Please type in your task.');
        $input.focus();
        return false;
    }
    $input.val('');
    $('.error').text('');
    $input.focus();
    var key = createKey();
    localStorage[key] = val;
    todoKey.push(key);
    localStorage['todoKey'] = JSON.stringify(todoKey);
    updateList($list,todoKey);
    updateBadge();
    location.reload();
}
function moveItem(key){
    movedKey.push(key);
    localStorage['movedKey'] = JSON.stringify(movedKey);
    var index = todoKey.indexOf(key);
    todoKey.splice(index,1);
    localStorage['todoKey'] = JSON.stringify(todoKey);
    updateList($list,todoKey);
    updateList($finishedlist,movedKey);
    updateBadge();
    location.reload();
}
function clearFinished(){
    for (var j = movedKey.length-1; j>=0 ; j--) {
        localStorage.removeItem(movedKey[j]);
    }
    localStorage.removeItem('movedKey');
    movedKey.length = 0;
    $finishedlist.empty();
}
/*UPDATE FUNCTIONS*/
function updateList(listID,storageKeyArr){
    listID.html("");
    for (var i = storageKeyArr.length-1; i >= 0 ; i--) {
        (function(i) {
            if (listID === $list){
                listID.append(addToDoList(storageKeyArr[i], localStorage));
                pressToMove1=document.getElementById(storageKeyArr[i]+'2');
                pressToMove1.addEventListener("click",function(){moveItem(storageKeyArr[i]);},false);
                $("#"+storageKeyArr[i]+">p").blur(function(){
                    editedContent = $("#"+storageKeyArr[i]+">p").html();
                    localStorage.setItem(storageKeyArr[i],editedContent);
                });
            }else{
                listID.append(addToFinishedList(storageKeyArr[i], localStorage));
            }
        }(i));
    }
}
/*HELPER FUNCTIONS*/
function createKey(){
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth();
    day = date.getDay();
    time = date.getHours() + date.getMinutes() + date.getSeconds();
    key = 'lo'+ year + month + day + time;
    return key;
}
function addToDoList(param1, param2){
    return '<li id="' + param1 + '"><a href="#" id="'+param1+'2"></a><p id="'+param1+'" contenteditable="true">'+param2[param1] + '</p></li>';
}
function addToFinishedList(param1, param2){
    return '<li id="' + param1 + '"><div id="doneDot"></div><p id="'+param1+'">'+ param2[param1] + '</p></li>';
}
function updateBadge() {
    if (todoKey.length > 0) color = [255, 0, 0, 255];
    else color = [0, 255, 0, 255];
    chrome.browserAction.setBadgeBackgroundColor({
        color: color
    });
    chrome.browserAction.setBadgeText({
        text: '' + todoKey.length
    });
}