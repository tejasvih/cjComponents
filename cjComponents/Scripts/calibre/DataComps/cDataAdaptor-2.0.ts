/*
 * cDataAdaptor 
 * Calibre Technologies
 * Tejasvi Hegde
 * */


"use strict";
class cDataAdaptor {
    //let da = new cDataAdaptor(data);

    OnGetData: any;
    IsRemoteData: boolean = false;

    //Input Can be array of objects or array of array. But data is converted to [{},{},{}] format
    //1. [{},{},{}]
    //2. { Columns: [array of string],Data : [[array of values],[],[]]}
    Data: any[] = []; //format: [{},{},{}]
    Columns: any[] = [];
    DataIsObjectArray: boolean = true;

    CurrentPage : number = 1; //value is 0 if no records exist or full data is retrieved using GetData() method
    TotalPages: number = 0;
    TotalRecords: number = 0;
    private _pageSize: number = 10;
    IsFirstPage: boolean = true;
    IsLastPage: boolean = true;


    SortedData : any;
    SortedColumnName: string;
    SortOrder: string;



    constructor(dataSource: any) {
        //this.greeting = message;
        this.loadData(dataSource);
    }

    private convertData(data : any) {
        //prepares array of objects from column and data
        let preparedData : any[] = [];
        data.forEach(function (row, rIndex) {
            let obj : any = {};
            row.forEach(function (val, index) {
                let key: number = (this.Columns.length > index) ? this.Columns[index] : '' + index;
                obj[key] = val;
            }, this);

            preparedData.push(obj);
        }, this);
        return preparedData;
    };

    private prepareColumnsFromData() {
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

    private loadData(dataSource : any) {

        this.TotalRecords = 0;
        this.TotalPages = 0;
        this.CurrentPage = 1;
        let data : any;


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


    //Public Methods
    public Sort(direction: string, colName: string) {
        if ((direction === undefined) || (direction === "")) {
            this.SortedColumnName = null;
            this.SortOrder = null;
            this.SortedData = null;
            return;
        }
        this.SortedColumnName = colName;
        this.SortOrder = direction;

        let sortOrder = 1;
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
    }


    public GetData = function (pageNo: number, pageSize: number) {
        let data : any = (this.SortedData !== null && this.SortedData !== undefined) ? this.SortedData : this.Data;
        this.IsFirstPage = true;
        this.IsLastPage = true;
        if ((pageNo !== undefined) && (pageNo > 0) && (pageNo < this.TotalPages)) {
            this.CurrentPage = pageNo;
        }

        if (pageSize === undefined) {
            pageSize = this.PageSize;
        }
        let startIndex: number = (this.CurrentPage - 1) * pageSize;
        let endIndex: number = startIndex + pageSize;
        data = data.slice(startIndex, endIndex);

        this.IsFirstPage = this.CurrentPage === 1;
        this.IsLastPage = this.CurrentPage === this.TotalPages;

        return data;
    }

    public FirstPage() {
        this.CurrentPage = 1;
    }

    public PrevPage = function () {
        if (this.CurrentPage > 1)
            this.CurrentPage--;
    }

    public NextPage() {
        if (this.CurrentPage < this.TotalPages)
            this.CurrentPage++;
    }

    public LastPage() {
        this.CurrentPage = this.TotalPages;
    }

    public GotoPage(pageNo: number) {
        if (pageNo < 1)
            pageNo = 1;
        if (pageNo > this.TotalPages)
            pageNo = this.TotalPages;
        this.CurrentPage = pageNo;
    }

    public RecordAt(index: number) {
        if ((index >= 0) && (index < this.TotalRecords))
            return this.Data[index];
        return null;
    }

    public get PageSize(): number {
        return this._pageSize;
    }

    public set PageSize(pageSize: number) {
        this._pageSize = pageSize;
        this.TotalRecords = this.Data.length;
        this.TotalPages = Math.floor(this.TotalRecords / this.PageSize);
        this.TotalPages += (this.TotalRecords % this.PageSize) > 0 ? 1 : 0;
    }


}

