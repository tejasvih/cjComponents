function __beforePost() {
    document.getElementById("submitButton").disabled = true;
    document.getElementById("submitButton").value = 'Saving...';
}
function __onComplete() {
    document.getElementById("submitButton").disabled = false;
    document.getElementById("submitButton").value = 'Save';
}
function __saveDataCallback(data) {
    var result = data[0][0];
    if (result !== null && result.Code == 0) {
        window.top.showGrowl("Message", result.Message);
        if (__postSaveReturnURL !== undefined)
            replaceUrl(__postSaveReturnURL);

    }
    else {

        alert(result !== null && result.Message != undefined ? result.Message : "Error while communicating with server");
    }
}