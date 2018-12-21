function RoundDecimal(value) {
    return Math.round(value * 100) / 100;
}
function toFloat(val) {
    var retVal = parseFloat(val);
    if (isNaN(retVal))
        return 0;

    return retVal;
}
function toInt(val) {
    var retVal = parseInt(val);
    if (isNaN(retVal))
        return 0;

    return retVal;
}

function roundUp(x) {
    return 0.5 * Math.ceil(2.0 * x);
}

function numToDisplay(x) {
    parseFloat(Math.round(x * 100) / 100).toFixed(2);
}

function goToUrl(url) {
    //like if you click on a link (it will be saved in the session history, so back button will work as expected)
    window.location.href = url;
}
function replaceUrl(url) {
    //As an HTTP redirect (back button will not work )
    //Does not reload same page. Use reloadPage() is url is same
    window.location.replace(url);
}
function reloadPage() {
    //Reloads same page again
    window.location.reload();
}
// parse a date in dd-mmm-yyyy format
function parseDate2(s) {
    if ((s == null) || (s == undefined))
        return;
    var months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

    var p = s.split('-');
    if (p.length < 3)
        return;
    return new Date(p[2], months[p[1].toLowerCase()], p[0]);
}
function dateToDMY(theDate) {
    var m_names = new Array("Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec");


    var curr_date = theDate.getDate();
    var curr_month = theDate.getMonth();
    var curr_year = theDate.getFullYear();
    return curr_date + "-" + m_names[curr_month] + "-" + curr_year;
}
// parse a date in yyyy-mm-dd format
function parseDate(input) {
    var parts = input.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]); // Note: months are 0-based
}
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (parts.length == 1) {
        parts[1] = '00';
    }
    return parts.join(".");
}
function parseTime(timeStr, dt) {
    if (!dt) {
        dt = new Date();
    }

    var time = timeStr.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
    if (!time) {
        return NaN;
    }
    var hours = parseInt(time[1], 10);
    dt.setHours(hours);
    dt.setMinutes(parseInt(time[2], 10) || 0);
    dt.setSeconds(0, 0);
    return dt;
}


function __element(id) {
    return document.getElementById(id);
}
function __dataObject(elem, name) {
    var dataJson = elem.getAttribute('data-' + name);
    return JSON.parse(dataJson);
}