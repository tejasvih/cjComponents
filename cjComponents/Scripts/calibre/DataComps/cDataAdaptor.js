"use strict";

function cDataAdaptor(dataSource) {

    this.OnGetData;
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
    this.PageSize = 10;
    this.IsFirstPage = true;
    this.IsLastPage = true;


    this.SortedData;
    this.SortedColumn;
    this.SortOrder;

    //const DEF_PAGE_SIZE = 10;
    function isFunction(v) {
        //If our variable is an instance of "Function"
        if (v instanceof Function) {
            return true;
        }
        return false;
        /*
         if (typeof data === "function") {
            // do something
        }
         * */
    }

    this.convertData = function (data) {
        //prepares array of objects from column and data
        var preparedData = [];
        data.forEach(function (row, rIndex) {
            var obj = {};
            row.forEach(function (val, index) {
                var key = (this.Columns.length > index) ? this.Columns[index] : '' + index;
                obj[key] = val;
            }, this);
            
            preparedData.push(obj);
        },this);
        return preparedData;
    };

    this.prepareColumnsFromData = function () {
        //Builds column names from data
        this.Columns = [];
        this.Data.forEach(function (row, rIndex) {
            Object.getOwnPropertyNames(row).forEach(
                function (val, idx, array) {
                    if (this.Columns.indexOf(val) < 0) {
                        this.Columns.push(val);
                    }
                }, this);
        }, this);
    };

    this.loadData = function (dataSource) {

        this.TotalRecords = 0;
        this.TotalPages = 0;
        this.CurrentPage = 1;
        var data;


        if (isFunction(data)) {
            this.OnGetData = dataSource;
            data = this.OnGetData();
            this.IsRemoteData = true;
        }
        else {
            data = dataSource;
            this.IsRemoteData = false;
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

    //Public Methods
    this.Sort = function (direction,colName) {

        if ((direction === undefined) || (direction === "")) {
            this.SortedColumn = null;
            this.SortOrder = null;
            this.SortedData = null;
            return;
        }
        this.SortedColumn = colName;
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


    this.GetData = function (pageNo,pageSize) {
        var data = (this.SortedData !== null && this.SortedData !== undefined) ? this.SortedData : this.Data;
        this.IsFirstPage = true;
        this.IsLastPage = true;
        if ((pageNo !== undefined) && (pageNo > 0) && (pageNo < this.TotalPages)){
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
   
    this.FirstPage = function () {
        this.CurrentPage = 1;
        //return this.GetData(1);
    };
    this.PrevPage = function () {
        if (this.CurrentPage > 1)
            this.CurrentPage--;
        //return this.GetData(this.CurrentPage);
    };
    this.NextPage = function () {
        if (this.CurrentPage < this.TotalPages)
            this.CurrentPage++;
        //return this.GetData(this.CurrentPage);
    };
    this.LastPage = function () {
        this.CurrentPage = this.TotalPages;
        //return this.GetData(this.TotalPages);
    };
    this.GotoPage = function (pageNo) {
        if (pageNo < 1)
            pageNo = 1;
        if (pageNo > this.TotalPages)
            pageNo = this.TotalPages;
        this.CurrentPage = pageNo;
    };
    this.RecordAt = function (index) {
        if ((index >= 0) && (index < this.TotalRecords))
            return this.Data[index];
        return null;
    };
    this.SetPageSize = function (pageSize) {
        this.PageSize = pageSize;
        this.TotalRecords = this.Data.length;
        this.TotalPages = Math.floor(this.TotalRecords / this.PageSize);
        this.TotalPages += (this.TotalRecords % this.PageSize) > 0 ? 1 : 0;
    };
    this.LoadData = function (dataSource) {
        this.loadData(dataSource);
    };

    this.loadData(dataSource);

}