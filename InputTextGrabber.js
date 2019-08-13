window.onbeforeunload = function() {
    var inputFields = document.getElementsByTagName('input');
    var textLibrary = {}
    for (var i = 0; i < inputFields.length; i ++) {
        if (inputFields[i].type === 'submit' || inputFields[i].type === 'tel') {
            textLibrary[findRelevantName(inputFields[i])] = inputFields[i].value
        }
    }
    console.log(textLibrary)
}

console.log('day man')
var globalNoFind = 0
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
        if (!exceptions.has(parentElement.innerText.trim().toLowerCase())) {
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