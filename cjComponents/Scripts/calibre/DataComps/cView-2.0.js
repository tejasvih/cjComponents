/*
 * cView
 * Calibre Technologies
 * Tejasvi Hegde
 * version 2.0
 * */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var cView = /** @class */ (function () {
    function cView(containerName, dataSource) {
        this.Container = document.getElementById(containerName);
        //this.self = this;
        this.Adaptor = new cDataAdaptor(dataSource);
    }
    cView.prototype.prepareView = function () {
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
    cView.prototype.Render = function () {
        this.prepareView();
    };
    cView.prototype.Sort = function (direction, colName) {
        this.Adaptor.Sort(direction, colName);
        this.Render();
    };
    return cView;
}());
/*
 * cGridView : Tabular Grid view
 * */
var cGridView = /** @class */ (function (_super) {
    __extends(cGridView, _super);
    function cGridView(containerName, dataSource, colDefs) {
        var _this = _super.call(this, containerName, dataSource) || this;
        _this.changePageEvent = function (event) {
            //'this' here represents element
            //use self
            var pn = event.target.getAttribute('data-pagenumber');
            var oldPage = _this.Adaptor.CurrentPage;
            if (pn === 'first')
                _this.Adaptor.FirstPage();
            else if (pn === 'prev') {
                _this.Adaptor.PrevPage();
            }
            else if (pn === 'next') {
                _this.Adaptor.NextPage();
            }
            else if (pn === 'last')
                _this.Adaptor.LastPage();
            else
                _this.Adaptor.GotoPage(parseInt(pn));
            if (oldPage !== _this.Adaptor.CurrentPage)
                _this.Render();
        };
        _this.changeSortEvent = function (event) {
            //'this' here represents element
            var pn = parseInt(event.target.getAttribute('data-colindex'));
            _this.ColumnsDefs.forEach(function (col, i) {
                if (pn !== i) {
                    col.SortDirection = "";
                }
            });
            var col = _this.ColumnsDefs[pn];
            if (col.SortDirection === "asc") {
                col.SortDirection = "desc";
            }
            else if (col.SortDirection === "desc") {
                col.SortDirection = "";
            }
            else {
                col.SortDirection = "asc";
            }
            _this.Adaptor.Sort(col.SortDirection, col.name);
            _this.Render();
        };
        _this.ColumnsDefs = colDefs;
        _this.initHandlers();
        _super.prototype.Render.call(_this);
        return _this;
    }
    cGridView.prototype.initHandlers = function () {
        //object event handlers
        this.OnGetViewStartHtml = function (sender) {
            var html = '<div class="c-grid-view">';
            return html;
        };
        this.OnGetViewEndHtml = function (sender) {
            var html = '</div>';
            return html;
        };
        this.OnGetHeaderHtml = function (sender) {
            var html = '<div class="c-grid-header-row row">';
            this.ColumnsDefs.forEach(function (col, i) {
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
        this.OnGetFooterHtml = function (sender) {
            if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
                return '';
            }
            var html = '<div class="c-grid-header-row row">';
            var s = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';
            var pagerStr = '<ul class="pagination pull-right" style="margin-top: 5px;margin-bottom: 5px">\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn first" data-pagenumber="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li>\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn previous" data-pagenumber="prev"><span class="glyphicon glyphicon-step-backward"></span></a></li>';
            for (var i = 1; i <= this.Adaptor.TotalPages; i++) {
                var cls = '';
                if (i === this.Adaptor.CurrentPage)
                    cls = 'active';
                pagerStr += '<li class="' + cls + '"><a href="javascript:void(0)" class="pager-btn pagenumber" data-pagenumber="' + i + '">' + i + '</a></li>';
            }
            s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';
            pagerStr += '<li class="' + s + '"><a href="javascript:void(0)" class="pager-btn next" data-pagenumber="next"><span class="glyphicon glyphicon-step-forward"></span></a></li>\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn last" data-pagenumber="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li>\
        </ul> ';
            html += pagerStr;
            html += '</div>';
            return html;
        };
        this.OnGetRecordHtml = function (sender, row, index) {
            var html = '<div class="c-grid-row row">';
            this.ColumnsDefs.forEach(function (col, cIndex) {
                var content = '';
                var size = col.width != null ? col.width : 1;
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
            var pagenums = container.getElementsByClassName("pager-btn");
            for (var i = 0; i < pagenums.length; i++) {
                //pagenums[i].myParam = {};
                pagenums[i].addEventListener('click', this.changePageEvent, false);
            }
            var cells = container.getElementsByClassName("c-grid-header-row")[0].getElementsByClassName("sorted");
            for (var i = 0; i < cells.length; i++) {
                //cells[i].myParam = {};
                cells[i].addEventListener('click', this.changeSortEvent, false);
            }
        };
    };
    return cGridView;
}(cView));
/*
 * cCardView : Card Grid view
 * */
var cCardView = /** @class */ (function (_super) {
    __extends(cCardView, _super);
    function cCardView(containerName, data, options) {
        var _this = _super.call(this, containerName, data) || this;
        _this.changePageEvent = function (event) {
            //'this' here represents element
            //use self
            var pn = event.target.getAttribute('data-pagenumber');
            var oldPage = _this.Adaptor.CurrentPage;
            if (pn === 'first')
                _this.Adaptor.FirstPage();
            else if (pn === 'prev') {
                _this.Adaptor.PrevPage();
            }
            else if (pn === 'next') {
                _this.Adaptor.NextPage();
            }
            else if (pn === 'last')
                _this.Adaptor.LastPage();
            else
                _this.Adaptor.GotoPage(parseInt(pn));
            if (oldPage !== _this.Adaptor.CurrentPage)
                _this.Render();
        };
        _this.options = (options == null) ? {} : options;
        _this.initHandlers();
        _this.cardTemplate = options.CardTemplate;
        _this.Adaptor.PageSize = (_this.options.PageSize === undefined) ? 3 : _this.options.PageSize;
        _this.cardSize = (options.CardSize === undefined) ? 3 : options.CardSize;
        _this.OnGetCardHtml = options.getCardHtmlCallback;
        _super.prototype.Render.call(_this);
        return _this;
    }
    cCardView.prototype.initHandlers = function () {
        //object event handlers
        this.OnGetViewStartHtml = function (sender) {
            var html = '<div class="card-grid">';
            return html;
        };
        this.OnGetViewEndHtml = function (sender) {
            var html = '</div>';
            return html;
        };
        this.OnGetDataViewStartHtml = function (sender) {
            var html = '<div class="row">';
            return html;
        };
        this.OnGetDataViewEndHtml = function (sender) {
            var html = '</div>';
            return html;
        };
        this.OnGetHeaderHtml = function (sender) {
            return '';
        };
        this.OnGetFooterHtml = function (sender) {
            if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
                return '';
            }
            var html = '<div class="card-grid-footer row">';
            var s = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';
            var pagerStr = '<ul class="pagination pull-right" style="margin-top: 5px;margin-bottom: 5px">\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn first" data-pagenumber="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li>\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn previous" data-pagenumber="prev"><span class="glyphicon glyphicon-step-backward"></span></a></li>';
            for (var i = 1; i <= this.Adaptor.TotalPages; i++) {
                var cls = '';
                if (i === this.Adaptor.CurrentPage)
                    cls = 'active';
                pagerStr += '<li class="' + cls + '"><a href="javascript:void(0)" class="pager-btn pagenumber" data-pagenumber="' + i + '">' + i + '</a></li>';
            }
            s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';
            pagerStr += '<li class="' + s + '"><a href="javascript:void(0)" class="pager-btn next" data-pagenumber="next"><span class="glyphicon glyphicon-step-forward"></span></a></li>\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn last" data-pagenumber="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li>\
        </ul> ';
            html += pagerStr;
            html += '</div>';
            return html;
        };
        this.OnGetRecordHtml = function (sender, row, index) {
            var html = '<div class="col-md-' + this.cardSize + '"><div class="card">';
            if (this.OnGetCardHtml != null) {
                html += this.OnGetCardHtml(row, index, this.cardTemplate);
            }
            html += '</div></div>';
            return html;
        };
        this.OnAttachedToDOM = function (sender, container) {
            var pagenums = container.getElementsByClassName("pager-btn");
            for (var i = 0; i < pagenums.length; i++) {
                //pagenums[i].myParam = {};
                pagenums[i].addEventListener('click', this.changePageEvent, false);
            }
        };
    };
    return cCardView;
}(cView));
/*
 * cGridView : Tabular Grid view
 * */
//function (container, dataSource, colDefs) {
var cTemplatedGridView = /** @class */ (function (_super) {
    __extends(cTemplatedGridView, _super);
    function cTemplatedGridView(containerName, data, colDefs) {
        var _this = _super.call(this, containerName, data) || this;
        _this.ColumnsDefs = colDefs;
        _this.initHandlers();
        _this.Adaptor.PageSize = 999;
        _super.prototype.Render.call(_this);
        return _this;
    }
    cTemplatedGridView.prototype.initHandlers = function () {
        //object event handlers
        this.OnGetViewStartHtml = function (sender) {
            var html = '<div class="c-grid-view">';
            return html;
        };
        this.OnGetViewEndHtml = function (sender) {
            var html = '</div>';
            return html;
        };
        this.OnGetHeaderHtml = function (sender) {
            var html = '<div class="c-grid-header-row row">';
            this.ColumnsDefs.forEach(function (col, i) {
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
        this.OnGetFooterHtml = function (sender) {
            if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
                return '';
            }
            var html = '<div class="c-grid-header-row row">';
            var s = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';
            var pagerStr = '<ul class="pagination pull-right" style="margin-top: 5px;margin-bottom: 5px">\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn first" data-pagenumber="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li>\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn previous" data-pagenumber="prev"><span class="glyphicon glyphicon-step-backward"></span></a></li>';
            for (var i = 1; i <= this.Adaptor.TotalPages; i++) {
                var cls = '';
                if (i === this.Adaptor.CurrentPage)
                    cls = 'active';
                pagerStr += '<li class="' + cls + '"><a href="javascript:void(0)" class="pager-btn pagenumber" data-pagenumber="' + i + '">' + i + '</a></li>';
            }
            s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';
            pagerStr += '<li class="' + s + '"><a href="javascript:void(0)" class="pager-btn next" data-pagenumber="next"><span class="glyphicon glyphicon-step-forward"></span></a></li>\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn last" data-pagenumber="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li>\
        </ul> ';
            html += pagerStr;
            html += '</div>';
            return html;
        };
        this.OnGetRecordHtml = function (sender, row, index) {
            var html = '<div class="c-grid-row row">';
            this.ColumnsDefs.forEach(function (col, cIndex) {
                var content = '';
                var size = col.width != null ? col.width : 1;
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
    };
    return cTemplatedGridView;
}(cView));
//# sourceMappingURL=cView-2.0.js.map