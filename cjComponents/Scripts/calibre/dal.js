/*
V 1.1 Calibre Technologies
*/
function __DALPostJson(request, options) {
    //format {name: "apiname", json : ''}
    __APIPost("/api/dal/json", request, options);
}

function __DALPostValues(request, options) {
    //format {"apiname" : {params}}
    __APIPost("/api/dal/post", request, options);
}

function __APIPost(url, request, options) {
    var toShowOverlay = (options.showOverlay != undefined) && (options.showOverlay == true);
    if (toShowOverlay) {
        __Global.showOverlay();
    }
    var onResult, onError, beforePost;
    if ((options.OnResult !== undefined) && (options.OnResult !== null)) {
        onResult = options.OnResult;
    }
    if ((options.OnError !== undefined) && (options.OnError !== null)) {
        onError = options.OnError;
    }
    if ((options.BeforePost !== undefined) && (options.BeforePost !== null)) {
        beforePost = options.BeforePost;
    }
    if (beforePost !== undefined) {
        var result = beforePost(request, options);
        if (result !== undefined) {
            if (result === false) {
                return false;
            }
            if (typeof result === 'object') {
                request = result;
            }
        }
    }
    $.ajax({
        type: "POST",
        url: url,
        data: request,
        cache: false,
        dataType: 'json',
        crossDomain: true,
        async: true,
        success: function (data) {
            if (toShowOverlay) {
                __Global.hideOverlay();
            }
            if (onResult !== undefined) {
                onResult(data, options);
            }
        },
        error: function (jqXhr, textStatus, errorThrown) {
            if (toShowOverlay) {
                __Global.hideOverlay();
            }
            if (onError !== undefined) {
                onError(jqXhr, textStatus, errorThrown, options);
            }
            else {
                alert('Error occurred while communicating with server. Please try again later');
            }
        },
        complete: function () {

            if ((options.OnComplete !== undefined) && (options.OnComplete !== null)) {
                options.OnComplete(options);
            }
            
        },
        beforeSend: function (event, jqXHR, ajaxOptions) {
            if ((options.BeforeSend !== undefined) && (options.BeforeSend !== null)) {
                options.BeforeSend(event, jqXHR, ajaxOptions,options);
            }
        }
    });
}