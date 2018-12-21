$(document).ready(function () {

    $.ajaxSetup({ cache: false });

    //IMPORTANT, otherwise min length select list validation for string wont run
    $.validator.prototype.getLength = function (value, element) {
        if (value != undefined)
            return value.length;
        return 0;
    }
});


__Global = {
    showOverlay: function () {
        $('body').append('<div id="requestOverlay" class="request-overlay"></div>');
        $("#requestOverlay").show();
    },
    hideOverlay: function () {
        $("#requestOverlay").remove();
    }
};

/*
if (typeof me.onChange === "function") { 
    // safe to use the function
}
*/

function setSelectOptions(elem, list) {
    elem.empty();
    $.each(list, function (index, itemdata) {
        elem.append(
            $('<option/>')
                .attr('value', itemdata.Value)
                .attr('data-index', index)
                .text(itemdata.Text)
        );
    });
}



/*
String.prototype.toFloat = function (defVal) {
    return toFloat(this);
};*/

function centreModal(dialogParent) {
    var dialog = dialogParent.find('.modal-dialog');
    dialogParent.css('display', 'block');
    dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}

function IsInIframe() {
    //if (window.self != window.top)
   // {
        //specific to JMS
    return (window.self.name != 'content' && window.self.name != 'mainDocument');
    //}
    //return false;
    /*
    return (window.self != window.top);

    if (window.frameElement) {
        // in frame
    }
    else {
        // not in frame
    }
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }*/
}

function addParameter(url, parameterName, parameterValue, atStart/*Add param before others*/) {
    replaceDuplicates = true;
    if (url.indexOf('#') > 0) {
        var cl = url.indexOf('#');
        urlhash = url.substring(url.indexOf('#'), url.length);
    } else {
        urlhash = '';
        cl = url.length;
    }
    sourceUrl = url.substring(0, cl);

    var urlParts = sourceUrl.split("?");
    var newQueryString = "";

    if (urlParts.length > 1) {
        var parameters = urlParts[1].split("&");
        for (var i = 0; (i < parameters.length) ; i++) {
            var parameterParts = parameters[i].split("=");
            if (!(replaceDuplicates && parameterParts[0] == parameterName)) {
                if (newQueryString == "")
                    newQueryString = "?";
                else
                    newQueryString += "&";
                newQueryString += parameterParts[0] + "=" + (parameterParts[1] ? parameterParts[1] : '');
            }
        }
    }
    if (newQueryString == "")
        newQueryString = "?";

    if (atStart) {
        newQueryString = '?' + parameterName + "=" + parameterValue + (newQueryString.length > 1 ? '&' + newQueryString.substring(1) : '');
    } else {
        if (newQueryString !== "" && newQueryString != '?')
            newQueryString += "&";
        newQueryString += parameterName + "=" + parameterValue;
    }
    return urlParts[0] + newQueryString + urlhash;
}
function BuildSelectOptions(elem, list, selVal) {
    if (elem === null)
        return;
    elem.empty();
    $.each(list, function (index, itemdata) {
        elem.append(
            $('<option/>')
                .attr('value', itemdata.id)
                .text(itemdata.text)
                .attr('data-index', index)
                .data('data', itemdata)

        );
    });
    elem.val(selVal);
}

function MakeInputsStaticDiabled() {
    //$("form").prop("disabled", true);
    $("input[type!='hidden'],textarea,select").prop("disabled", true).removeClass('form-control').addClass('simple-control');
    $(".input-group-addon").removeClass('input-group-addon');
    $(".input-group").addClass('simple-input-group');

    $(".control-label").addClass('simple-control-label');
    //
    //

}

// string.format(...)
// First, checks if it isn't implemented yet.
// string format library is used instead
/*
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}*/






function BuildSelectOptions2(elemName, list, selVal, idTag, textTag, addSelect) {

    elem = document.getElementById(elemName);
    if (elem == null) return;

    while (elem.options.length > 0) {
        elem.remove(0);
    }

    if (addSelect) {
        elem.add(new Option("", "", true, true));
    }
    idTag = idTag === undefined ? "id" : idTag;
    textTag = textTag === undefined ? "text" : textTag;
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var idVal = item[idTag];
        var opt = new Option(item[textTag], idVal, (idVal == selVal), (idVal == selVal));
        opt.setAttribute('data-index', i);
        opt.setAttribute('data-data', JSON.stringify(item));
        elem.add(opt);
    }
    if (selVal !== undefined) elem.value = selVal;
}

function buildDropdownOpts(elemName, options, selValue, emptyOption) {

    elem = document.getElementById(elemName);
    if (elem === null) return;
    var optsHtml = "";
    if (emptyOption !== undefined) {
        optsHtml += '<option value="">' + emptyOption + '</option>';
    }
    
    Object.getOwnPropertyNames(options).forEach(
        function (key, idx, array) {
            var text = options[key];
            var selected = (key === selValue) ? 'selected' : '';
            optsHtml += '<option value="' + key + '" ' + selected + '>' + text + '</option>';
        });
    elem.innerHTML = optsHtml;
}