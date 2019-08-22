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

    IsFooterRequired: boolean = true;
    _footer: string;

    //[{ data: "Name", title: "Name", width: 4 }, {  },...
    ColumnsDefs: any[];
    ViewElement: any;

   
    IsHtmlBased: boolean = false;
    Config: any;
    constructor(containerName: string, dataSource: any, config: any) {
        //, isHtmlBased: boolean = true
        this.Config = config || {};
        this.Container = document.getElementById(containerName);
        this.Adaptor = new cDataAdaptor(dataSource,[]);
        //this.IsHtmlBased = this.Config.IsHtmlBased == null ? true : this.Config.IsHtmlBased;
    }

    get Footer(): string {
        return this._footer;
    }
    set Footer(footer: string) {
        this._footer = footer;
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
    CreateHeader(container) { }
    CreateFooter(container) { }
    CreateDataContainer(container) {
        return document.createElement('div');
    }
    CreateRecord(container, row, index) { }

    //methods
    public Render() {
        this.prepareView();
    }
    public Sort(direction: string, colName: string) {
        this.Adaptor.Sort(direction, colName);
        this.Render();
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

    BuildPager(container) {
        let pagerElement = cUtils.GetElement('nav');
        container.appendChild(pagerElement);

        let ul = cUtils.GetElement('ul', 'pagination pull-right');
        pagerElement.appendChild(ul);


        let s: string = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';

        let li = this.getPagingItem("first", 'First', s, ' first ' + s);
        ul.appendChild(li);

        li = this.getPagingItem("prev", 'Previous', s, ' previous ' + s);
        ul.appendChild(li);

        for (let i = 1; i <= this.Adaptor.TotalPages; i++) {
            let cls: string = '';
            if (i === this.Adaptor.CurrentPage)
                cls = 'active';

            li = this.getPagingItem('' + i, '' + i, cls, ' pagenumber');
            ul.appendChild(li);
        }

        s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';

        li = this.getPagingItem("next", 'Next', s, ' next ' + s);
        ul.appendChild(li);

        li = this.getPagingItem("last", 'Last', s, ' last ' + s);
        ul.appendChild(li);
    }
    changeSortEvent = (event: any) => {
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
    getPagingItem(val, title, itemcls, linkcls) {
        let li = cUtils.GetElement('li', 'page-item ' + itemcls);
        //let a = GetElement('a', 'page-link first' + s, null, { "href": "javascript:void(0)", "data-pagenumber": "first" });
        //let a = GetElement('a', 'page-link first' + s, null, { "href": "javascript:void(0)", "data": "pagenumber : 'first'" });
        let a = cUtils.GetElement('a', 'page-link ' + linkcls, null, { "href": "javascript:void(0)", "pagenumber": val }, title);
        a.dataset.pagenumber = val;
        a.onclick = this.changePageEvent;
        //let span = GetElement('span', 'material-icons',null,null,this.pagerFirstClassName);//<i class="material-icons">description</i>

        //let span = GetElement('span', null, null, null, 'First');
        //a.appendChild(span);
        li.appendChild(a);
        return li;
    }

    addContentToElement(content, element) {
        if (content != null) {
            if (cUtils.IsObject(content)) {
                element.appendChild(content);
            }
            else {

                let children = cUtils.GetElementsFromHTML(content);
                if (children != null)
                        element.appendChild(children);
            }

        }
    }
}

/*
 * cGridView : Tabular Grid view
 * */
class cGridView extends cView {

    

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
        this.IsHtmlBased = false;

        super.Render();
    }
    

    InitView() {
        super.InitView();
        this.ViewElement.className += " c-grid-view";
    }

    CreateHeader(container) {
        super.CreateHeader(container);
        let headerElement = cUtils.GetElement('div', 'row c-grid-header-row');
        this.ColumnsDefs.forEach(function (col, i) {
            let title: string = (col.title != null) ? col.title : '';
            let sortSpan: any = null;
            let headerColElement = cUtils.GetElement('div', 'c-grid-cecUtils.ll ' + GetSizeClass(col.width), null, { "data-colindex": i });
            if ((col.name != null) && (col.name.trim() !== '')) {

                if (col.sortable == null || col.sortable == true) {
                    headerColElement.className += ' sorted'
                    headerColElement.style.cursor = 'pointer';
                    headerColElement.onclick = this.changeSortEvent;
                }

                if (col.SortDirection === "asc") {
                    sortSpan = cUtils.GetElement('span', this.sortUpClassName + ' text-info', 'margin-left:4px;');
                }
                else if (col.SortDirection === "desc") {
                    sortSpan = cUtils.GetElement('span', this.sortDownClassName + ' text-info', 'margin-left:4px;');
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

        let footerElement = cUtils.GetElement('div', 'row c-grid-footer-row');
        if (this.Footer) {
            let textNode = document.createTextNode(this.Footer);
            footerElement.appendChild(textNode);
        }

        //create navigation pager
        if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
            return footerElement;
        }

        this.BuildPager(footerElement);
        
        container.appendChild(footerElement);
        return footerElement;
    };

    CreateRecord(container, row, index) {
        super.CreateRecord(container, row, index);
        let rowElement = cUtils.GetElement('div', 'row c-grid-row');
        this.ColumnsDefs.forEach(function (col, cIndex) {
            let content: any;
            if (col.render != null) {
                content = col.render(this, row, cIndex, index, col);
            }
            else {
                if ((col.name != null) && (col.name.trim() !== '') && (row[col.name] != null))
                    content = row[col.name];
            }
            let colElement = cUtils.GetElement('div', 'c-grid-cell ' + GetSizeClass(col.width));
            this.addContentToElement(content, colElement);
            
            rowElement.appendChild(colElement);
        }, this);
        container.appendChild(rowElement);
        return rowElement;
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

        this.cardTemplate = options.CardTemplate;
        this.Adaptor.PageSize = (this.options.PageSize === undefined) ? 3 : this.options.PageSize;
        this.cardSize = (options.CardSize === undefined) ? 3 : options.CardSize;
        this.IsHtmlBased = false;
        
        this.OnGetCardHtml = options.getCardHtmlCallback;

        super.Render();
    }

    InitView() {
        super.InitView();
        this.ViewElement.className += " card-grid";
    }
    CreateDataContainer(container) {
        let element = super.CreateDataContainer(container);
        element.className += " row";
        return element;
    }
    CreateFooter(container) {
        super.CreateFooter(container);
        if (!this.IsFooterRequired)
            return null;

        let footerElement = cUtils.GetElement('div', 'row card-grid-footer');
        if (this.Footer) {
            let textNode = document.createTextNode(this.Footer);
            footerElement.appendChild(textNode);
        }

        //create navigation pager
        if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
            return footerElement;
        }

        this.BuildPager(footerElement);


        container.appendChild(footerElement);
        return footerElement;
    }
    CreateRecord(container, row, index) {
        super.CreateRecord(container, row, index);
        let cardContainerElement = cUtils.GetElement('div', GetSizeClass(this.cardSize));
        container.appendChild(cardContainerElement);

        let cardElement = cUtils.GetElement('div', 'card');
        cardContainerElement.appendChild(cardElement);

        if (this.OnGetCardHtml != null) {
            let content = this.OnGetCardHtml(row, index, this.cardTemplate);
            this.addContentToElement(content, cardElement);
        }

        
        return cardContainerElement;
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
        //this.initHandlers();
        this.Adaptor.PageSize = 999;
        super.Render();
    }

    InitView() {
        super.InitView();
        this.ViewElement.className += " c-grid-view";
    }
    CreateDataContainer(container) {
        let element = super.CreateDataContainer(container);
        element.className += " c-grid-data-container";
        return element;
    }
    CreateHeader(container) {
        super.CreateHeader(container);
        let headerElement = cUtils.GetElement('div', 'row c-grid-header-row');
        this.ColumnsDefs.forEach(function (col, i) {
            let title: string = (col.title != null) ? col.title : '';
            let headerColElement = cUtils.GetElement('div', 'c-grid-cell ' + GetSizeClass(col.width), null, { "data-colindex": i });
            let textNode = document.createTextNode(title);
            headerColElement.appendChild(textNode);
            headerElement.appendChild(headerColElement);
        }, this);
        container.appendChild(headerElement);
        return headerElement;
    }
    
    CreateRecord(container, row, index) {
        super.CreateRecord(container, row, index);
        let rowElement = cUtils.GetElement('div', 'row c-grid-row');
        this.ColumnsDefs.forEach(function (col, cIndex) {
            let content: any;
            if (col.render != null) {
                content = col.render(this, row, cIndex, index, col);
            }
            else {
                if ((col.name != null) && (col.name.trim() !== '') && (row[col.name] != null))
                    content = row[col.name];
            }
            let colElement = cUtils.GetElement('div', 'c-grid-cell ' + GetSizeClass(col.width));
            this.addContentToElement(content, colElement);

            rowElement.appendChild(colElement);
        }, this);
        container.appendChild(rowElement);
        return rowElement;
    }

}