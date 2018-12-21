function BindFormNavigation(formId) {


    function moveNext(evt,fcsable,elem) {
        evt.preventDefault();
        var nxt = fcsable.eq(fcsable.index(elem) + 1);
        if (!nxt.length) {
            nxt = fcsable.eq(0);
        }
        if (nxt.length)
            nxt.focus();
    }
    function movePrev(evt, fcsable, elem) {
        evt.preventDefault();
        var prv = fcsable.eq(fcsable.index(elem) - 1);
        if (!prv.length) {
            prv = fcsable.eq(fcsable.length - 1);
        }
        if (prv.length)
            prv.focus();
    }

    $(formId).on('keydown', 'a,input, select, button,textarea', function (e) {
        var self = $(this)
            , form = self.parents('form:eq(0)')
            , next
            , prev
            , isFirstLine = true, isLastLine = true
            , toMove = true;

        var focusable = form.find('input,a,select,button,textarea').filter(':visible');

        var UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39, ENTER = 13;

        if (e.target.tagName.toLowerCase() == 'textarea') {


            if (!((e.keyCode == UP) || (e.keyCode == DOWN) || (e.keyCode == RIGHT) || (e.keyCode == LEFT) || (e.keyCode == ENTER)))
                return;


            var content = this.value;
            var valLen = content.length;
            if (valLen == 0)
                return;

            var isFirstPos = e.target.selectionStart === 0;
            var isLastPos = e.target.selectionEnd === valLen;


            var lastLineFeedPos = content.lastIndexOf("\n");
            if (lastLineFeedPos < 0)
                lastLineFeedPos = content.length;
            var firstLineFeedPos = content.indexOf("\n");
            if (firstLineFeedPos < 0)
                firstLineFeedPos = content.length;


            var lastLine = content.substr(lastLineFeedPos + 1);

            var firstLine = content.substr(0, firstLineFeedPos);
            var isInFirstLine = e.target.selectionStart <= firstLineFeedPos;
            var isInLastLine = e.target.selectionEnd >= lastLineFeedPos;
            
            //Up
            switch (e.keyCode) {
                case UP: {
                    if (!isInFirstLine) return;
                    movePrev(e, focusable,this);
                    return;
                }
                case DOWN: {
                    if (!isInLastLine) return;
                    moveNext(e, focusable, this);
                    return;
                }
                case RIGHT: {
                    if (!isLastPos) return;
                    moveNext(e, focusable, this);
                    
                    return;
                }
                case LEFT: {
                    if (!isFirstPos) return;
                    movePrev(e, focusable, this);
                    return;
                }
                case ENTER: {
                    var endsWithNewLine = content[valLen - 1] == '\n';
                    if (!isLastPos) return;
                    if (!endsWithNewLine) return;
                    moveNext(e, focusable, this);
                    return;
                }
                    
            }
            return;
        }

        if ((e.keyCode == 13) || (e.keyCode == 37) || (e.keyCode == 38) || (e.keyCode == 39) || (e.keyCode == 40) || (e.keyCode == 8)) {
            //                focusable = form.find('input,a,select,button,textarea').filter(':visible');
            switch (e.keyCode) {
                case 13: {
                    moveNext(e, focusable, this);
                }
                    break;
                case 37: { //left


                    if (e.target.tagName.toLowerCase() === 'input') {
                        if (e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length) {
                            e.target.setSelectionRange(0, 0);
                        }
                        else {
                            if (e.target.selectionStart === 0) {
                                e.target.setSelectionRange(0, 0);
                            }
                            else {
                                toMove = false;
                            }
                        }
                    }

                    if (toMove) {
                        movePrev(e, focusable, this);
                    }

                }
                    break;
                case 38: { //up

                    if (e.target.tagName.toLowerCase() === 'select') {
                        toMove = false;
                    }

                    if (toMove) {
                        movePrev(e, focusable, this);
                    }

                }
                    break;
                case 39: { //right
                    if (e.target.tagName.toLowerCase() === 'input') {
                        if (e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length) {
                            e.target.setSelectionRange(0, 0);
                        }
                        else {
                            if (e.target.selectionEnd === e.target.value.length) {
                                e.target.setSelectionRange(0, 0);
                            }
                            else {
                                toMove = false;
                            }
                        }
                    }

                    if (toMove) {
                        moveNext(e, focusable, this);
                    }
                }
                    break;
                case 40: { //down
                    if (e.target.tagName.toLowerCase() === 'select') {
                        toMove = false;
                    }

                    if (toMove) {
                        moveNext(e, focusable, this);
                    }
                }
                    break;
                /*  case 8: { // backspace (to avoid going back one page e.g. in Chrome)
                      e.preventDefault();
                  }
                      break;*/

            }
            if (toMove) {
                var elem = $(e.target);
                if (elem.hasClass('datepicker')) {
                    elem.datepicker('hide');
                }
                // 
            }
            //return (!toMove);//false;
        }





    });

}