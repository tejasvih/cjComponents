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
    ViewElement: any;

    //events
    OnGetViewStartHtml: any;
    OnGetViewEndHtml: any;
    OnGetHeaderHtml: any;
    OnGetFooterHtml: any;
    OnGetRecordHtml: any;
    OnAttachedToDOM: any;

    OnGetDataViewStartHtml: any;
    OnGetDataViewEndHtml: any;
    IsHtmlBased: boolean = true;
    Config: any;
    constructor(containerName: string, dataSource: any, config: any) {
        //, isHtmlBased: boolean = true
        this.Config = config || {};
        this.Container = document.getElementById(containerName);
        this.Adaptor = new cDataAdaptor(dataSource);
        this.IsHtmlBased = this.Config.IsHtmlBased == null ? true : this.Config.IsHtmlBased;
    }



    private prepareViewHtml() {
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
    private prepareView() {
        
        
        this.InitView();
        this.CreateHeader(this.ViewElement);
        let dataContainer = this.CreateDataContainer(this.ViewElement);
        this.ViewElement.appendChild(dataContainer);
        var data = this.Adaptor.GetData();
        data.forEach(function (row, index) {
            this.CreateRecord(dataContainer, row, index);
        }, this);
        this.CreateFooter(this.ViewElement);

        //clear and set content on DOM
        while (this.Container.lastChild) {
            this.Container.removeChild(this.Container.lastChild);
        }
        this.Container.appendChild(this.ViewElement);
    }

    InitView() {
        this.ViewElement = document.createElement('div');
    }
    CreateHeader(container) {}
    CreateFooter(container) { }
    CreateDataContainer(container) {
        return document.createElement('div');
    }
    CreateRecord(container, row, index) {}

    //methods
    public Render() {
        if (this.IsHtmlBased) {
            this.prepareViewHtml()
        }
        else
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

    IsFooterRequired: boolean = true;
    _footer: string;

    /*Material icon*/
    sortUpClassName: string = 'arrow_drop_up';   //glyphicon glyphicon-arrow-up
    sortDownClassName: string = 'arrow_drop_down'; //glyphicon glyphicon-arrow-down

    pagerFirstClassName: string = 'first_page'; //glyphicon glyphicon-fast-backward
    pagerPrevClassName: string = 'chevron_left'; //glyphicon-step-backward
    pagerNextClassName: string = 'chevron_right'; //glyphicon glyphicon-step-forward
    pagerLastClassName: string = 'last_page'; //glyphicon glyphicon-fast-forward

    constructor(containerName: string, dataSource: any, colDefs: any, config: any) {
        super(containerName, dataSource, config);
        this.ColumnsDefs = colDefs;
        if (this.IsHtmlBased)
            this.initHandlers();
        super.Render();
    }
    get Footer(): string {
        return this._footer;
    }
    set Footer(footer: string) {
        this._footer = footer;
    }

    InitView() {
        super.InitView();
        this.ViewElement.className += " c-grid-view";
    }
    
    CreateHeader(container) {
        super.CreateHeader(container);
        let headerElement = GetElement('div', 'row c-grid-header-row');
        this.ColumnsDefs.forEach(function (col, i) {
            let title: string = (col.title != null) ? col.title : '';
            let size: number = 1;
            let sortSpan: any = null;
            //let sortCls: string = '';
            let headerColElement = GetElement('div', 'c-grid-cell ' + GetSizeClass(col.width) , null, { "data-colindex": i });
            if ((col.name != null) && (col.name.trim() !== '')) {
                
                if (col.sortable == null || col.sortable == true) {
                    headerColElement.className += ' sorted'
                    headerColElement.style.cursor = 'pointer';
                    headerColElement.onclick = this.changeSortEvent;
                }
                
                if (col.SortDirection === "asc") {
                    sortSpan = GetElement('span', this.sortUpClassName + ' text-info', 'margin-left:4px;');
                }
                else if (col.SortDirection === "desc") {
                    sortSpan = GetElement('span', this.sortDownClassName + ' text-info', 'margin-left:4px;');
                }
                
            }
            
            
            
            let textNode = document.createTextNode(title);
            headerColElement.appendChild(textNode);
            if (sortSpan)
                headerColElement.appendChild(sortSpan);
            headerElement.appendChild(headerColElement);
        }, this);
        container.appendChild(headerElement);
        return headerElement;
    };
    CreateFooter(container) {
        super.CreateFooter(container);
        if (!this.IsFooterRequired)
            return null;

        let footerElement = GetElement('div', 'row c-grid-footer-row');
        if (this.Footer) {
            let textNode = document.createTextNode(this.Footer);
            footerElement.appendChild(textNode);
        }
        
        //create navigation pager
        if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
            return footerElement;
        }

        let s: string = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';
        let pagerElement = GetElement('nav');
        let ul = GetElement('ul', 'pagination pull-right');
        footerElement.appendChild(ul);
        let li = GetElement('li', 'page-item ' + s);
        //let a = GetElement('a', 'page-link first' + s, null, { "href": "javascript:void(0)", "data-pagenumber": "first" });
        //let a = GetElement('a', 'page-link first' + s, null, { "href": "javascript:void(0)", "data": "pagenumber : 'first'" });
        let a = GetElement('a', 'page-link first' + s, null, { "href": "javascript:void(0)", "pagenumber": "first" }, 'First');
        a.dataset.pagenumber = 'first';
        a.onclick  = this.changePageEvent;
        //let span = GetElement('span', 'material-icons',null,null,this.pagerFirstClassName);//<i class="material-icons">description</i>

        //let span = GetElement('span', null, null, null, 'First');
        //a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);

        li = GetElement('li', 'page-item ' + s);
        a = GetElement('a', 'page-link previous' + s, null, { "href": "javascript:void(0)", "pagenumber": "prev" },'Previous');
        a.dataset.pagenumber = 'prev';
        a.onclick = this.changePageEvent;
        //span = GetElement('span', null,null,null,'Previous');
        //a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);

       

        for (let i = 1; i <= this.Adaptor.TotalPages; i++) {
            let cls: string = '';
            if (i === this.Adaptor.CurrentPage)
                cls = 'active';
            li = GetElement('li', 'page-item ' + cls);
            a = GetElement('a', 'page-link pagenumber' + s, null, { "href": "javascript:void(0)", "pagenumber": i },i);
            a.dataset.pagenumber = ''+i;
            a.onclick = this.changePageEvent;
            //let txt = document.createTextNode(''+i);
            //a.appendChild(txt);
            li.appendChild(a);
            ul.appendChild(li);

        }

        s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';

        li = GetElement('li', 'page-item ' + s);
        a = GetElement('a', 'page-link next' + s, null, { "href": "javascript:void(0)", "pagenumber": "next" }, 'Next');
        a.dataset.pagenumber = 'next';
        a.onclick = this.changePageEvent;
        //span = GetElement('span', 'material-icons',null,null,this.pagerNextClassName);
        //span = GetElement('span', null, null, null, 'Next');
        //a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);

        li = GetElement('li', 'page-item ' + s);
        a = GetElement('a', 'page-link last' + s, null, { "href": "javascript:void(0)", "pagenumber": "last" }, 'Last');
        a.dataset.pagenumber = 'last';
        a.onclick = this.changePageEvent;
        //span = GetElement('span', 'material-icons',null,null,this.pagerLastClassName);
        //span = GetElement('span', null, null, null, 'Last');
        //a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);
        container.appendChild(footerElement);
        return footerElement;
    };

    CreateRecord(container,  row, index) {
    super.CreateRecord(container,  row, index);
        let rowElement = GetElement('div', 'row c-grid-row');
        this.ColumnsDefs.forEach(function (col, cIndex) {
            let content: any;
            if (col.render != null) {
                content = col.render(this, row, cIndex, index, col);
            }
            else {
                if ((col.name != null) && (col.name.trim() !== '') && (row[col.name] != null))
                    content = row[col.name];
            }
            let colElement = GetElement('div', 'c-grid-cell ' + GetSizeClass(col.width));
            if (content != null) {
                if (IsObject(content)) {
                    colElement.appendChild(content);
                }
                else {

                    let children = GetElementFromHTML(content);
                    if (children != null)
                        while (children.length > 0) {
                            colElement.appendChild(children[0]);
                        }
                    /*children.forEach(child => colElement.appendChild(child))
                    
                    if (Array.isArray(children)) {
                        children.forEach(child => colElement.appendChild(child))
                    } else {
                        colElement.appendChild(children);
                    }
                    */
                }

            }
            rowElement.appendChild(colElement);
        }, this);
        container.appendChild(rowElement);
        return rowElement;
    };
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
        //var pn = event.target.getAttribute('data-pagenumber');
        //if (pn == null)
        let pn = event.currentTarget.dataset.pagenumber;
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
        super(containerName, data, options);
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



    constructor(containerName: string, data: any, colDefs: any, options: any) {
        super(containerName, data, options);
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