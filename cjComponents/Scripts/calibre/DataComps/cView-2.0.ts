/*
 * cView
 * Calibre Technologies
 * Tejasvi Hegde
 * version 2.0
 * */
"use strict";
class cView {

    //properties
    Adaptor: any;
    Container: any;

    //[{ data: "Name", title: "Name", width: 4 }, {  },...
    ColumnsDefs: any[];


    //events
    OnGetViewStartHtml: any;
    OnGetViewEndHtml: any;
    OnGetHeaderHtml: any;
    OnGetFooterHtml: any;
    OnGetRecordHtml: any;
    OnAttachedToDOM: any;

    OnGetDataViewStartHtml: any;
    OnGetDataViewEndHtml: any;


    constructor(containerName: string, dataSource: any) {

        this.Container = document.getElementById(containerName);
        //this.self = this;
        this.Adaptor = new cDataAdaptor(dataSource);
    }



    private prepareView() {
        let html: string = '';

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

    }

    //methods
    public Render() {
        this.prepareView();
    }
    public Sort(direction: string, colName: string) {
        this.Adaptor.Sort(direction, colName);
        this.Render();
    }

}

/*
 * cGridView : Tabular Grid view
 * */
class cGridView extends cView {

    constructor(containerName: string, dataSource: any, colDefs: any) {
        super(containerName, dataSource);
        this.ColumnsDefs = colDefs;
        this.initHandlers();
        super.Render();
    }


    private initHandlers() {
        //object event handlers
        this.OnGetViewStartHtml = function (sender) {
            let html: string = '<div class="c-grid-view">';
            return html;
        };

        this.OnGetViewEndHtml = function (sender) {
            let html: string = '</div>';
            return html;
        };

        this.OnGetHeaderHtml = function (sender) {
            let html: string = '<div class="c-grid-header-row row">';
            this.ColumnsDefs.forEach(function (col, i) {
                let title: string = (col.title != null) ? col.title : '';
                let size: number = 1;
                let sortSpan: string = '';
                let sortCls: string = '';

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
        this.OnGetFooterHtml = function (sender) {
            if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
                return '';
            }
            let html: string = '<div class="c-grid-header-row row">';

            let s: string = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';
            let pagerStr: string = '<ul class="pagination pull-right" style="margin-top: 5px;margin-bottom: 5px">\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn first" data-pagenumber="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li>\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn previous" data-pagenumber="prev"><span class="glyphicon glyphicon-step-backward"></span></a></li>';

            for (let i = 1; i <= this.Adaptor.TotalPages; i++) {
                let cls: string = '';
                if (i === this.Adaptor.CurrentPage)
                    cls = 'active';
                pagerStr += '<li class="' + cls + '"><a href="javascript:void(0)" class="pager-btn pagenumber" data-pagenumber="' + i + '">' + i + '</a></li>';
            }

            s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';
            pagerStr += '<li class="' + s + '"><a href="javascript:void(0)" class="pager-btn next" data-pagenumber="next"><span class="glyphicon glyphicon-step-forward"></span></a></li>\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn last" data-pagenumber="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li>\
        </ul> ';


            html += pagerStr;
            html += '</div>';
            return html;
        };

        this.OnGetRecordHtml = function (sender, row, index) {
            let html: string = '<div class="c-grid-row row">';
            this.ColumnsDefs.forEach(function (col, cIndex) {
                let content: string = '';
                let size: number = col.width != null ? col.width : 1;
                if (col.render != null) {
                    content = col.render(sender, row, cIndex, index, col);
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

        this.OnAttachedToDOM = function (sender, container) {
            let pagenums: any[] = container.getElementsByClassName("pager-btn");
            for (var i = 0; i < pagenums.length; i++) {
                //pagenums[i].myParam = {};
                pagenums[i].addEventListener('click', this.changePageEvent, false);
            }
            var cells = container.getElementsByClassName("c-grid-header-row")[0].getElementsByClassName("sorted");
            for (var i = 0; i < cells.length; i++) {
                //cells[i].myParam = {};
                cells[i].addEventListener('click', this.changeSortEvent, false);
            }
        }
    }

    private changePageEvent = (event: any) => {
        //'this' here represents element
        //use self
        var pn = event.target.getAttribute('data-pagenumber');
        var oldPage = this.Adaptor.CurrentPage;
        if (pn === 'first')
            this.Adaptor.FirstPage();
        else if (pn === 'prev') {
            this.Adaptor.PrevPage();
        }
        else if (pn === 'next') {
            this.Adaptor.NextPage();
        }
        else if (pn === 'last')
            this.Adaptor.LastPage();
        else
            this.Adaptor.GotoPage(parseInt(pn));

        if (oldPage !== this.Adaptor.CurrentPage)
            this.Render();
    };

    private changeSortEvent = (event: any) => {
        //'this' here represents element
        var pn = parseInt(event.target.getAttribute('data-colindex'));
        this.ColumnsDefs.forEach(function (col, i) {
            if (pn !== i) {
                col.SortDirection = "";
            }
        });

        var col = this.ColumnsDefs[pn];
        if (col.SortDirection === "asc") {
            col.SortDirection = "desc";
        }
        else if (col.SortDirection === "desc") {
            col.SortDirection = "";
        }
        else {
            col.SortDirection = "asc";

        }
        this.Adaptor.Sort(col.SortDirection, col.name);
        this.Render();
    };


}

/*
 * cCardView : Card Grid view
 * */
class cCardView extends cView {
    //if any property needs to be set, it has to be set to this.Instance.

    options: any;
    cardTemplate: any;
    cardSize: number;
    OnGetCardHtml: any;


    constructor(containerName: string, data: any, options: any) {
        super(containerName, data);
        this.options = (options == null) ? {} : options;
        this.initHandlers();
        this.cardTemplate = options.CardTemplate;
        this.Adaptor.PageSize = (this.options.PageSize === undefined) ? 3 : this.options.PageSize;


        this.cardSize = (options.CardSize === undefined) ? 3 : options.CardSize;
        this.OnGetCardHtml = options.getCardHtmlCallback;

        super.Render();
    }

    private initHandlers() {
        //object event handlers
        this.OnGetViewStartHtml = function (sender) {
            let html: string = '<div class="card-grid">';
            return html;
        };
        this.OnGetViewEndHtml = function (sender) {
            let html: string = '</div>';
            return html;
        };

        this.OnGetDataViewStartHtml = function (sender) {
            let html: string = '<div class="row">';
            return html;
        };
        this.OnGetDataViewEndHtml = function (sender) {
            let html: string = '</div>';
            return html;
        };

        this.OnGetHeaderHtml = function (sender) {
            return '';
        };
        this.OnGetFooterHtml = function (sender) {
            if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
                return '';
            }
            let html: string = '<div class="card-grid-footer row">';

            let s: string = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';
            let pagerStr: string = '<ul class="pagination pull-right" style="margin-top: 5px;margin-bottom: 5px">\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn first" data-pagenumber="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li>\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn previous" data-pagenumber="prev"><span class="glyphicon glyphicon-step-backward"></span></a></li>';

            for (let i = 1; i <= this.Adaptor.TotalPages; i++) {
                let cls: string = '';
                if (i === this.Adaptor.CurrentPage)
                    cls = 'active';
                pagerStr += '<li class="' + cls + '"><a href="javascript:void(0)" class="pager-btn pagenumber" data-pagenumber="' + i + '">' + i + '</a></li>';
            }

            s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';
            pagerStr += '<li class="' + s + '"><a href="javascript:void(0)" class="pager-btn next" data-pagenumber="next"><span class="glyphicon glyphicon-step-forward"></span></a></li>\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn last" data-pagenumber="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li>\
        </ul> ';


            html += pagerStr;
            html += '</div>';
            return html;
        };

        this.OnGetRecordHtml = function (sender, row, index) {
            let html: string = '<div class="col-md-' + this.cardSize + '"><div class="card">';
            if (this.OnGetCardHtml != null) {
                html += this.OnGetCardHtml(row, index, this.cardTemplate);
            }
            html += '</div></div>';
            return html;
        };

        this.OnAttachedToDOM = function (sender, container) {
            let pagenums: any[] = container.getElementsByClassName("pager-btn");
            for (var i = 0; i < pagenums.length; i++) {
                //pagenums[i].myParam = {};
                pagenums[i].addEventListener('click', this.changePageEvent, false);
            }

        }
    }

    changePageEvent = (event) => {
        //'this' here represents element
        //use self
        var pn = event.target.getAttribute('data-pagenumber');
        var oldPage = this.Adaptor.CurrentPage;
        if (pn === 'first')
            this.Adaptor.FirstPage();
        else if (pn === 'prev') {
            this.Adaptor.PrevPage();
        }
        else if (pn === 'next') {
            this.Adaptor.NextPage();
        }
        else if (pn === 'last')
            this.Adaptor.LastPage();
        else
            this.Adaptor.GotoPage(parseInt(pn));

        if (oldPage !== this.Adaptor.CurrentPage)
            this.Render();
    };

}

/*
 * cGridView : Tabular Grid view
 * */
//function (container, dataSource, colDefs) {
class cTemplatedGridView extends cView {



    constructor(containerName: string, data: any, colDefs: any) {
        super(containerName, data);
        this.ColumnsDefs = colDefs;
        this.initHandlers();
        this.Adaptor.PageSize = 999;
        super.Render();
    }

    private initHandlers() {
        //object event handlers
        this.OnGetViewStartHtml = function (sender) {
            let html: string = '<div class="c-grid-view">';
            return html;
        };
        this.OnGetViewEndHtml = function (sender) {
            let html: string = '</div>';
            return html;
        };

        this.OnGetHeaderHtml = function (sender) {
            let html: string = '<div class="c-grid-header-row row">';
            this.ColumnsDefs.forEach(function (col, i) {
                let title: string = (col.title != null) ? col.title : '';
                let size: number = 1;

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
        this.OnGetFooterHtml = function (sender) {
            if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
                return '';
            }
            let html: string = '<div class="c-grid-header-row row">';

            let s: string = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';
            let pagerStr: string = '<ul class="pagination pull-right" style="margin-top: 5px;margin-bottom: 5px">\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn first" data-pagenumber="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li>\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn previous" data-pagenumber="prev"><span class="glyphicon glyphicon-step-backward"></span></a></li>';

            for (let i = 1; i <= this.Adaptor.TotalPages; i++) {
                let cls: string = '';
                if (i === this.Adaptor.CurrentPage)
                    cls = 'active';
                pagerStr += '<li class="' + cls + '"><a href="javascript:void(0)" class="pager-btn pagenumber" data-pagenumber="' + i + '">' + i + '</a></li>';
            }

            s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';
            pagerStr += '<li class="' + s + '"><a href="javascript:void(0)" class="pager-btn next" data-pagenumber="next"><span class="glyphicon glyphicon-step-forward"></span></a></li>\
            <li class="'+ s + '"><a href="javascript:void(0)" class="pager-btn last" data-pagenumber="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li>\
        </ul> ';


            html += pagerStr;
            html += '</div>';
            return html;
        };

        this.OnGetRecordHtml = function (sender, row, index) {
            let html: string = '<div class="c-grid-row row">';
            this.ColumnsDefs.forEach(function (col, cIndex) {
                let content: string = '';
                let size: number = col.width != null ? col.width : 1;
                if (col.render != null) {
                    content = col.render(sender, row, cIndex, index, col);
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
    }





}