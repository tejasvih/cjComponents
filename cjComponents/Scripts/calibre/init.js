

function bindCss(elem) {
    if (elem === undefined)
        elem = document;

    /*
    $(elem).find('input[data-val-number][type!="hidden"][type!="radio"]:not(.number)').autoNumeric('init', { aSep: '', mDec: '2', vMin: 0 });
    $(elem).find('input[data-val-number0][type!="hidden"]').autoNumeric('init', { aSep: '', mDec: '0', vMin: 0 });
    $(elem).find('.numberInput, .integer').autoNumeric('init', { aSep: '', mDec: '0', vMin: 0 });
    $(elem).find('.number').autoNumeric('init', { aSep: '', mDec: '2', vMin: 0 });
    $(elem).find('.single-digit').autoNumeric('init', { aSep: '', mDec: '1', vMin: 0 });
    */
    //$(elem).find('.decimal').autoNumeric('init', { aSep: '', mDec: '2', vMin: 0 });

    //var aaa = new AutoNumeric('.decimal > input', { allowDecimalPadding : 'always' });

    /*

    new Cleave('.integer', {
        numeral: false,
        numeralThousandsGroupStyle: 'lakh'
    });
    */

    initDateTimePickers(elem);
}


function initDateTimePickers(elem) {

    /*
    $(elem).find('.datetimepicker').datetimepicker({
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        }

    });
    */
    $(elem).find('.datepicker').datepicker({ format: 'dd-M-yyyy', autoclose: true }).on('changeDate', function (e) {
        $(this).valid();
    });


  
    /*
    $(elem).find('.timepicker').datetimepicker({
        //          format: 'H:mm',    // use this format if you want the 24hours timepicker
        format: 'h:mm A', //use this format if you want the 12hours timpiecker with AM/PM toggle
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        }
    });
    */
    $(elem).find('.clockpicker').clockpicker({
        autoclose: true,
        donetext: 'Done'
    });
}

$(function () {
    bindCss();
    $('body').on('focus', 'input.select-on-focus, .integer', function (e) {
        $(this)
            .one('mouseup', function () {
                $(this).select();
                return false;
            })
            .select();
    });


    //disable browser moving back when backspace is pressed
    $(document).on("keydown", function (e) {
        if (e.which === 8 && !$(e.target).is("input:not([readonly]):not([type=radio]):not([type=checkbox]), textarea, [contentEditable], [contentEditable=true]")) {
            e.preventDefault();
        }
    });

    
});

