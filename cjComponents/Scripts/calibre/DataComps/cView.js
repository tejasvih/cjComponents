"use strict";

function cView(container, dataSource) {

    //properties
    this.Adaptor;
    this.Container = document.getElementById(container);

    //[{ data: "Name", title: "Name", width: 4 }, {  },...
    this.ColumnsDefs;
    this.Instance = this; //call methods from this property. to support inheritence
    //events
    this.OnGetViewStartHtml;
    this.OnGetViewEndHtml;
    this.OnGetHeaderHtml;
    this.OnGetFooterHtml;
    this.OnGetRecordHtml;
    this.OnAttachedToDOM;

    this.OnGetDataViewStartHtml;
    this.OnGetDataViewEndHtml;
    //internal
    var self = this;
    
    
    this.prepareView = function () {
        var html = '';

        //container start
        if (this.OnGetViewStartHtml !== undefined) {
            html += this.OnGetViewStartHtml(this);
        }

        //header
        if (this.OnGetHeaderHtml !== undefined) {
            html += this.OnGetHeaderHtml(this);
        }
        //body
        if (this.OnGetDataViewStartHtml !== undefined) {
            html += this.OnGetDataViewStartHtml(this);
        }
        var data = this.Adaptor.GetData();
        data.forEach(function (row, index) {
            if (this.OnGetRecordHtml !== undefined) {
                html += this.OnGetRecordHtml(this, row, index);
            }
        }, this);
        if (this.OnGetDataViewEndHtml !== undefined) {
            html += this.OnGetDataViewEndHtml(this);
        }
        //footer
        if (this.OnGetFooterHtml !== undefined) {
            html += this.OnGetFooterHtml(this);
        }

        //container end
        if (this.OnGetViewEndHtml !== undefined) {
            html += this.OnGetViewEndHtml(this);
        }
        //set html
        this.Container.innerHTML = html;

        if (this.OnAttachedToDOM !== undefined) {
            this.OnAttachedToDOM(this, this.Container);
        }
        
    };

    //methods
    this.Render = function () {
        this.prepareView();
    };
    this.Sort = function (direction, colName) {
        this.Adaptor.Sort(direction, colName);
        this.Render();
    };
    //init
    this.Adaptor = new cDataAdaptor(dataSource);
    this.FirstPage = this.Adaptor.FirstPage;
    this.PrevPage = this.Adaptor.PrevPage;
    this.NextPage = this.Adaptor.NextPage;
    this.LastPage = this.Adaptor.LastPage;
    

    //Init
    
    
    return this;
}

/*
 * cGridView : Tabular Grid view
 * */
function cGridView(container, dataSource,colDefs) {
    //if any property needs to be set, it has to be set to this.Instance.
    var self = this;

    var parent = new cView(container, dataSource);
    this.Instance = parent.Instance;
    this.Instance.ColumnsDefs = colDefs;

    //object variables
    var Adaptor = this.Instance.Adaptor;
    var TheInstance = this.Instance;


    //object event handlers
    this.Instance.OnGetViewStartHtml = function (sender) {
        var html = '<div class="c-grid-view">';
        return html;
    };
    this.Instance.OnGetViewEndHtml = function (sender) {
        var html = '</div>';
        return html;
    };

    this.Instance.OnGetHeaderHtml = function (sender) {
        var html = '<div class="c-grid-header-row row">';
        this.Instance.ColumnsDefs.forEach(function (col, i) {
            var title = (col.title != null) ? col.title : '';
            var size = 1;
            var sortSpan = '';
            var sortCls = '';
            
            if ((col.name != null) && (col.name.trim() !== '')) {
                sortCls = 'sorted';
                if (col.SortDirection === "asc") {
                    sortSpan = '<span class="glyphicon glyphicon-arrow-up text-info" style="margin-left:4px;"></span>';
                }
                else if (col.SortDirection === "desc") {
                    sortSpan = '<span class="glyphicon glyphicon-arrow-down text-info" style="margin-left:4px;"></span>';
                }
                else {
                    sortSpan = '';
                }
            }
            if (col.width !== undefined) {
                size = col.width;
            }
            else {
                col.width = 1;
            }

            html += '<div style="cursor:pointer" data-colindex=' + i + ' class="c-grid-cell col-md-' + size + ' ' + sortCls + '">' + title + sortSpan + '</div>';
        }, this);

        html += '</div>';
        return html;
    };
    this.Instance.OnGetFooterHtml = function (sender) {
        if (Adaptor.TotalRecords < Adaptor.PageSize) {
            return '';
        }
        var html = '<div class="c-grid-header-row row">';

        var s = Adaptor.CurrentPage === 1 ? ' disabled ' : '';
        var pagerStr = '<ul class="pagination pull-right" style="margin-top: 5px;margin-bottom: 5px">\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn first" data-pagenumber="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li>\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn previous" data-pagenumber="prev"><span class="glyphicon glyphicon-step-backward"></span></a></li>';

        for (var i = 1; i <= Adaptor.TotalPages; i++) {
            var cls = '';
            if (i === Adaptor.CurrentPage)
                cls = 'active';
            pagerStr += '<li class="' + cls + '"><a href="javascript:void(0)" class="pager-btn pagenumber" data-pagenumber="' + i + '">' + i + '</a></li>';
        }

        s = Adaptor.CurrentPage === Adaptor.TotalPages ? ' disabled ' : '';
        pagerStr += '<li class="' + s + '"><a href="javascript:void(0)" class="pager-btn next" data-pagenumber="next"><span class="glyphicon glyphicon-step-forward"></span></a></li>\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn last" data-pagenumber="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li>\
        </ul> ';


        html += pagerStr;
        html += '</div>';
        return html;
    };

    this.Instance.OnGetRecordHtml = function (sender, row, index) {
        var html = '<div class="c-grid-row row">';
        this.Instance.ColumnsDefs.forEach(function (col, cIndex) {
            var content = '';
            var size = col.width != null ? col.width : 1;
            if (col.render != null) {
                content = col.render(sender,row, cIndex,index,col);
            }
            else {
                if ((col.name != null) && (col.name.trim() !== '') && (row[col.name] != null))
                    content = row[col.name];
            }
            html += '<div class="c-grid-cell col-md-' + size + '">' + content + '</div>';
        }, this);
        html += '</div>';
        return html;
    };

    this.Instance.OnAttachedToDOM = function (sender,container) {
        var pagenums = container.getElementsByClassName("pager-btn");
        for (var i = 0; i < pagenums.length; i++) {
            //pagenums[i].myParam = {};
            pagenums[i].addEventListener('click', self.changePageEvent, false);
        }
        var cells = container.getElementsByClassName("c-grid-header-row")[0].getElementsByClassName("sorted");
        for (var i = 0; i < cells.length; i++) {
            //cells[i].myParam = {};
            cells[i].addEventListener('click', self.changeSortEvent, false);
        }
    }

    this.changePageEvent = function (event) {
        //'this' here represents element
        //use self
        var pn = this.getAttribute('data-pagenumber');
        var oldPage = Adaptor.CurrentPage;
        if (pn === 'first')
            Adaptor.FirstPage();
        else if (pn === 'prev') {
            Adaptor.PrevPage();
        }
        else if (pn === 'next') {
            Adaptor.NextPage();
        }
        else if (pn === 'last')
            Adaptor.LastPage();
        else
            Adaptor.GotoPage(parseInt(pn));

        if (oldPage !== Adaptor.CurrentPage)
            TheInstance.Render();
    };

    this.changeSortEvent = function (event) {
        //'this' here represents element
        var pn = parseInt(this.getAttribute('data-colindex'));
        TheInstance.ColumnsDefs.forEach(function (col, i) {
            if (pn !== i) {
                col.SortDirection = "";
            }
        });

        var col = TheInstance.ColumnsDefs[pn];
        if (col.SortDirection === "asc") {
            col.SortDirection = "desc";
        }
        else if (col.SortDirection === "desc") {
            col.SortDirection = "";
        }
        else {
            col.SortDirection = "asc";

        }
        Adaptor.Sort(col.SortDirection, col.name);
        TheInstance.Render();
    };

    this.Instance.Render();
    return this.Instance;
}

/*
 * cCardView : Card Grid view
 * */
function cCardView(container, data, options) {
    //if any property needs to be set, it has to be set to this.Instance.
    var self = this;
    options = (options == null) ? {} : options;
    var cardTemplate = options.CardTemplate;
    var parent = new cView(container, data);
    this.Instance = parent.Instance;
    //this.Instance.ColumnsDefs = colDefs;

    //object variables
    var Adaptor = this.Instance.Adaptor;
    Adaptor.SetPageSize((options.PageSize === undefined) ? 3 : options.PageSize);
    var TheInstance = this.Instance;

    var cardSize = (options.CardSize === undefined) ? 3 : options.CardSize;
    this.OnGetCardHtml = options.getCardHtmlCallback;

    //object event handlers
    this.Instance.OnGetViewStartHtml = function (sender) {
        var html = '<div class="card-grid">';
        return html;
    };
    this.Instance.OnGetViewEndHtml = function (sender) {
        var html = '</div>';
        return html;
    };

    this.Instance.OnGetDataViewStartHtml = function (sender) {
        var html = '<div class="row">';
        return html;
    };
    this.Instance.OnGetDataViewEndHtml = function (sender) {
        var html = '</div>';
        return html;
    };
  
    this.Instance.OnGetHeaderHtml = function (sender) {
        return '';
    };
    this.Instance.OnGetFooterHtml = function (sender) {
        if (Adaptor.TotalRecords < Adaptor.PageSize) {
            return '';
        }
        var html = '<div class="card-grid-footer row">';

        var s = Adaptor.CurrentPage === 1 ? ' disabled ' : '';
        var pagerStr = '<ul class="pagination pull-right" style="margin-top: 5px;margin-bottom: 5px">\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn first" data-pagenumber="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li>\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn previous" data-pagenumber="prev"><span class="glyphicon glyphicon-step-backward"></span></a></li>';

        for (var i = 1; i <= Adaptor.TotalPages; i++) {
            var cls = '';
            if (i === Adaptor.CurrentPage)
                cls = 'active';
            pagerStr += '<li class="' + cls + '"><a href="javascript:void(0)" class="pager-btn pagenumber" data-pagenumber="' + i + '">' + i + '</a></li>';
        }

        s = Adaptor.CurrentPage === Adaptor.TotalPages ? ' disabled ' : '';
        pagerStr += '<li class="' + s + '"><a href="javascript:void(0)" class="pager-btn next" data-pagenumber="next"><span class="glyphicon glyphicon-step-forward"></span></a></li>\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn last" data-pagenumber="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li>\
        </ul> ';


        html += pagerStr;
        html += '</div>';
        return html;
    };

    this.Instance.OnGetRecordHtml = function (sender, row, index) {
        var html = '<div class="col-md-' + cardSize+'"><div class="card">';
        if (self.OnGetCardHtml != null) {
            html += self.OnGetCardHtml(row, index, cardTemplate);
        }
        html += '</div></div>';
        return html;
    };

    this.Instance.OnAttachedToDOM = function (sender, container) {
        var pagenums = container.getElementsByClassName("pager-btn");
        for (var i = 0; i < pagenums.length; i++) {
            //pagenums[i].myParam = {};
            pagenums[i].addEventListener('click', self.changePageEvent, false);
        }
        
    }

    this.changePageEvent = function (event) {
        //'this' here represents element
        //use self
        var pn = this.getAttribute('data-pagenumber');
        var oldPage = Adaptor.CurrentPage;
        if (pn === 'first')
            Adaptor.FirstPage();
        else if (pn === 'prev') {
            Adaptor.PrevPage();
        }
        else if (pn === 'next') {
            Adaptor.NextPage();
        }
        else if (pn === 'last')
            Adaptor.LastPage();
        else
            Adaptor.GotoPage(parseInt(pn));

        if (oldPage !== Adaptor.CurrentPage)
            TheInstance.Render();
    };

    

    this.Instance.Render();
    return this.Instance;
}

/*
 * cGridView : Tabular Grid view
 * */
function cTemplatedGridView(container, dataSource, colDefs) {
    //if any property needs to be set, it has to be set to this.Instance.
    var self = this;

    var parent = new cView(container, dataSource);
    this.Instance = parent.Instance;
    this.Instance.ColumnsDefs = colDefs;

    //object variables
    var Adaptor = this.Instance.Adaptor;
    var TheInstance = this.Instance;


    //object event handlers
    this.Instance.OnGetViewStartHtml = function (sender) {
        var html = '<div class="c-grid-view">';
        return html;
    };
    this.Instance.OnGetViewEndHtml = function (sender) {
        var html = '</div>';
        return html;
    };

    this.Instance.OnGetHeaderHtml = function (sender) {
        var html = '<div class="c-grid-header-row row">';
        this.Instance.ColumnsDefs.forEach(function (col, i) {
            var title = (col.title != null) ? col.title : '';
            var size = 1;
            
            if (col.width !== undefined) {
                size = col.width;
            }
            else {
                col.width = 1;
            }

            html += '<div class="c-grid-cell col-md-' + size + '">' + title + '</div>';
        }, this);

        html += '</div>';
        return html;
    };
    this.Instance.OnGetFooterHtml = function (sender) {
        if (Adaptor.TotalRecords < Adaptor.PageSize) {
            return '';
        }
        var html = '<div class="c-grid-header-row row">';

        var s = Adaptor.CurrentPage === 1 ? ' disabled ' : '';
        var pagerStr = '<ul class="pagination pull-right" style="margin-top: 5px;margin-bottom: 5px">\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn first" data-pagenumber="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li>\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn previous" data-pagenumber="prev"><span class="glyphicon glyphicon-step-backward"></span></a></li>';

        for (var i = 1; i <= Adaptor.TotalPages; i++) {
            var cls = '';
            if (i === Adaptor.CurrentPage)
                cls = 'active';
            pagerStr += '<li class="' + cls + '"><a href="javascript:void(0)" class="pager-btn pagenumber" data-pagenumber="' + i + '">' + i + '</a></li>';
        }

        s = Adaptor.CurrentPage === Adaptor.TotalPages ? ' disabled ' : '';
        pagerStr += '<li class="' + s + '"><a href="javascript:void(0)" class="pager-btn next" data-pagenumber="next"><span class="glyphicon glyphicon-step-forward"></span></a></li>\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn last" data-pagenumber="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li>\
        </ul> ';


        html += pagerStr;
        html += '</div>';
        return html;
    };

    this.Instance.OnGetRecordHtml = function (sender, row, index) {
        var html = '<div class="c-grid-row row">';
        this.Instance.ColumnsDefs.forEach(function (col, cIndex) {
            var content = '';
            var size = col.width != null ? col.width : 1;
            if (col.render != null) {
                content = col.render(sender, row, cIndex, index,col);
            }
            else {
                if ((col.name != null) && (col.name.trim() !== '') && (row[col.name] != null))
                    content = row[col.name];
            }
            html += '<div class="c-grid-cell col-md-' + size + '">' + content + '</div>';
        }, this);

        /*
        if (self.OnGetRowHtml != null) {
            html += self.OnGetCardHtml(row, index, cardTemplate);
        }
        */
        html += '</div>';
        return html;
    };

   
    Adaptor.SetPageSize(999);
    this.Instance.Render();
    return this.Instance;
}