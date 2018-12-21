/*
 * cDataAdaptor
 * Calibre Technologies
 * Tejasvi Hegde
 * */
"use strict";
var cDataAdaptor = /** @class */ (function () {
    function cDataAdaptor(dataSource) {
        this.IsRemoteData = false;
        //Input Can be array of objects or array of array. But data is converted to [{},{},{}] format
        //1. [{},{},{}]
        //2. { Columns: [array of string],Data : [[array of values],[],[]]}
        this.Data = []; //format: [{},{},{}]
        this.Columns = [];
        this.DataIsObjectArray = true;
        this.CurrentPage = 1; //value is 0 if no records exist or full data is retrieved using GetData() method
        this.TotalPages = 0;
        this.TotalRecords = 0;
        this._pageSize = 10;
        this.IsFirstPage = true;
        this.IsLastPage = true;
        this.GetData = function (pageNo, pageSize) {
            var data = (this.SortedData !== null && this.SortedData !== undefined) ? this.SortedData : this.Data;
            this.IsFirstPage = true;
            this.IsLastPage = true;
            if ((pageNo !== undefined) && (pageNo > 0) && (pageNo < this.TotalPages)) {
                this.CurrentPage = pageNo;
            }
            if (pageSize === undefined) {
                pageSize = this.PageSize;
            }
            var startIndex = (this.CurrentPage - 1) * pageSize;
            var endIndex = startIndex + pageSize;
            data = data.slice(startIndex, endIndex);
            this.IsFirstPage = this.CurrentPage === 1;
            this.IsLastPage = this.CurrentPage === this.TotalPages;
            return data;
        };
        this.PrevPage = function () {
            if (this.CurrentPage > 1)
                this.CurrentPage--;
        };
        //this.greeting = message;
        this.loadData(dataSource);
    }
    cDataAdaptor.prototype.convertData = function (data) {
        //prepares array of objects from column and data
        var preparedData = [];
        data.forEach(function (row, rIndex) {
            var obj = {};
            row.forEach(function (val, index) {
                var key = (this.Columns.length > index) ? this.Columns[index] : '' + index;
                obj[key] = val;
            }, this);
            preparedData.push(obj);
        }, this);
        return preparedData;
    };
    ;
    cDataAdaptor.prototype.prepareColumnsFromData = function () {
        //Builds column names from data
        this.Columns = [];
        this.Data.forEach(function (row, rIndex) {
            Object.getOwnPropertyNames(row).forEach(function (val, idx, array) {
                if (this.Columns.indexOf(val) < 0) {
                    this.Columns.push(val);
                }
            }, this);
        }, this);
    };
    ;
    cDataAdaptor.prototype.loadData = function (dataSource) {
        this.TotalRecords = 0;
        this.TotalPages = 0;
        this.CurrentPage = 1;
        var data;
        if (isFunction(data)) {
            this.OnGetData = dataSource;
            data = this.OnGetData();
            //this.IsRemoteData = true;
        }
        else {
            data = dataSource;
            //this.IsRemoteData = false;
        }
        //blank out data and return if data is not returned
        if (data == null) {
            this.Data = [];
            this.Columns = [];
            return;
        }
        if (Array.isArray(data)) {
            this.Data = data;
            this.prepareColumnsFromData();
        }
        else if (typeof data === 'object') {
            if (data.Columns !== undefined) {
                this.Columns = data.Columns;
            }
            if (data.Data !== undefined) {
                this.Data = this.convertData(data.Data);
            }
        }
        this.TotalRecords = this.Data.length;
        this.TotalPages = Math.floor(this.TotalRecords / this.PageSize);
        this.TotalPages += (this.TotalRecords % this.PageSize) > 0 ? 1 : 0;
    };
    ;
    //Public Methods
    cDataAdaptor.prototype.Sort = function (direction, colName) {
        if ((direction === undefined) || (direction === "")) {
            this.SortedColumnName = null;
            this.SortOrder = null;
            this.SortedData = null;
            return;
        }
        this.SortedColumnName = colName;
        this.SortOrder = direction;
        var sortOrder = 1;
        if (direction === "desc") {
            sortOrder = -1;
        }
        this.SortedData = this.Data.concat().sort(function (a, b) {
            if (a[colName] < b[colName])
                return -1 * sortOrder;
            if (a[colName] > b[colName])
                return 1 * sortOrder;
            return 0;
        });
    };
    cDataAdaptor.prototype.FirstPage = function () {
        this.CurrentPage = 1;
    };
    cDataAdaptor.prototype.NextPage = function () {
        if (this.CurrentPage < this.TotalPages)
            this.CurrentPage++;
    };
    cDataAdaptor.prototype.LastPage = function () {
        this.CurrentPage = this.TotalPages;
    };
    cDataAdaptor.prototype.GotoPage = function (pageNo) {
        if (pageNo < 1)
            pageNo = 1;
        if (pageNo > this.TotalPages)
            pageNo = this.TotalPages;
        this.CurrentPage = pageNo;
    };
    cDataAdaptor.prototype.RecordAt = function (index) {
        if ((index >= 0) && (index < this.TotalRecords))
            return this.Data[index];
        return null;
    };
    Object.defineProperty(cDataAdaptor.prototype, "PageSize", {
        get: function () {
            return this._pageSize;
        },
        set: function (pageSize) {
            this._pageSize = pageSize;
            this.TotalRecords = this.Data.length;
            this.TotalPages = Math.floor(this.TotalRecords / this.PageSize);
            this.TotalPages += (this.TotalRecords % this.PageSize) > 0 ? 1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    return cDataAdaptor;
}());
//# sourceMappingURL=cDataAdaptor-2.0.js.map