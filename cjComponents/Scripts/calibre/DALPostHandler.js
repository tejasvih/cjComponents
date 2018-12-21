/**
 * Default methods if not supplied
 */
function __beforePost() {
    document.getElementById("submitButton").disabled = true;
    document.getElementById("submitButton").value = 'Saving...';
}
function __onComplete() {
    document.getElementById("submitButton").disabled = false;
    document.getElementById("submitButton").value = 'Save';
}
/*
function __defSaveDataCallback(data) {
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
*/


function __saveDataCallback(data, options) {
    var url;
    if ((options.returnURL !== undefined) && (options.returnURL !== null)) {
        url = options.returnURL;
    }
    var result = data[0][0];
    if (result === undefined || result === null) {
        return;
    }
    if (result.Code !== undefined && result.Code == 0) {
        if (result.Message !== undefined) {
            window.top.showGrowl("Message", result.Message);
            //showGrowlWarning(result.Title !== undefined ? result.Title : "", result.Message);
        }
        
        if (url !== undefined) {
            if (result.Params !== undefined) {
                url = url + '?' + result.Params;
            }
            replaceUrl(url);
        }
    }
    else {
        alert(result.Message);
    }
}
function __saveDataError(jqXhr, textStatus, errorThrown, options,fieldsToSetNull) {
    alert('Error occurred while communicating with server. Please try again later');
}
/***/
function BindFormSubmit(formId, postingApi, options) {
    options = options || {};
    if ((options.OnResult === undefined) || (options.OnResult === null)) {
        options.OnResult = __saveDataCallback;
    }
    if ((options.OnError === undefined) || (options.OnError === null)) {
        options.OnError = __saveDataError;
    }

    if ((options.BeforePost === undefined) || (options.BeforePost === null)) {
        options.BeforePost = __beforePost;
    }

    if ((options.OnComplete === undefined) || (options.OnComplete === null)) {
        options.OnComplete = __onComplete;
    }

    //
        $('#' + formId).on("submit", function (event) {
            event.preventDefault();
            var form = $(this);
            var isValid = form.valid();
            if (!isValid) {
                return false;
            }
            var formObj = form2js(formId, '.', false, null);
            //fieldsToSetNull = fieldsToSetNull || [];
            var convertToNull = (options.defToNull !== undefined);// || (fieldsToSetNull.length > 0);
            if (convertToNull) {
                Object.getOwnPropertyNames(formObj).forEach(
                    function (key, idx, array) {
                        //if ((fieldsToSetNull.length > 0) && fieldsToSetNull.indexOf(key) >= 0) {
                            if (formObj[key] === '')
                                formObj[key] = null;
                        //}
                        
                    });
            }
            
            formObj["__EMPId"] = __EMPId;
            formObj["CreatedBy"] = __EMPId;
            formObj["ModifiedBy"] = __EMPId;
            var request = {
                'name': postingApi,
                'json': JSON.stringify(formObj) /*{ json: JSON.stringify(formObj), empId: __EmpId }*/
            };
            __DALPostJson(request, options);
        });
}