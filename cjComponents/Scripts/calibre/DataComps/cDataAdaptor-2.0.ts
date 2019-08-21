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
    
    AjaxConfig: any;
    
    //Input Can be array of objects or array of array. But data is converted to [{},{},{}] format
    //1. [{},{},{}]
    //2. { Columns: [array of string],Data : [[array of values],[],[]]}
    Data: any[] = []; //storage format: [{col: value},{col: value},...]
    Columns: any[] = [];
    //DataIsObjectArray: boolean = true;

    CurrentPage : number = 1; //value is 0 if no records exist or full data is retrieved using GetData() method
    TotalPages: number = 0;
    TotalRecords: number = 0;
    private _pageSize: number = 10;
    IsFirstPage: boolean = true;
    IsLastPage: boolean = true;


    SortedData : any;
    SortedColumnName: string;
    SortOrder: string;
    private _dataSource: any;


    constructor(dataSource: any,columnNames : string[]) {
        
        if (cUtils.isFunction(dataSource)) {
            this.OnGetData = dataSource;
            this.IsRemoteData = true;
        }
        else if ((typeof dataSource === 'object') && (dataSource.ajax !== undefined)) {
            this.IsRemoteData = true;
            this.AjaxConfig = dataSource.ajax;
            
        }
        else {
            //data is supplied in any of two format
            this.initPreLoadedData(dataSource);
        }
        this.Columns = columnNames !== undefined ? columnNames : [];
        this._dataSource = dataSource;
        //this.loadData(dataSource);
    }

    private convertData(data: any) {
        //data.Data
        //data.Columns : optional, or can be set separately. otherwise __<index> is used as column name
        //prepares array of objects to [{col: value},{col: value},...] format from column and data
        if (data.Columns !== undefined) {
            this.Columns = data.Columns;
        }
        let preparedData: any[] = [];
        if (data.Data != null) {
            data.Data.forEach(function (row, rIndex) {
                let obj: any = {};
                row.forEach(function (val, index) {
                    let key: number = (this.Columns.length > index) ? this.Columns[index] : '__' + index;
                    obj[key] = val;
                }, this);

                preparedData.push(obj);
            }, this);
        }
        
        return preparedData;
    };
    private checkAndGetData(data) {
        if (Array.isArray(data) && (data.length > 0 && (typeof data[0] === 'object'))) {
            //Data is in [{col: value},{col: value},...] format
            return data;
            //this.prepareColumnsFromData();
        }
        else if (typeof data === 'object') {
            //data is either in data { Columns : [], Data : [] } format or array of values
            return this.convertData(data);
        }
    }
    private initPreLoadedData(dataSource: any) {
        //loads and prepares if initially supplied data

        //blank out data and return if data is not available
        if(dataSource == null) {
            this.Data = [];
            this.Columns = [];
            return;
        }
        this.Data = this.checkAndGetData(dataSource);

        this.TotalRecords = this.Data.length;
        this.TotalPages = Math.floor(this.TotalRecords / this.PageSize);
        this.TotalPages += (this.TotalRecords % this.PageSize) > 0 ? 1 : 0;
    }

    private loadData(dataSource : any) {

        this.TotalRecords = 0;
        this.TotalPages = 0;
        this.CurrentPage = 1;
        let data : any;

        if (cUtils.isFunction(dataSource)) {
            this.OnGetData = dataSource;
            data = this.OnGetData(this.CurrentPage, this.PageSize, this.SortedColumnName, this.SortOrder);
        }
        else {
                data = dataSource;
        }


        //blank out data and return if data is not available
        if (data == null) {
            this.Data = [];
            this.Columns = [];
            return;
        }
        this.Data = this.checkAndGetData(data);

        this.TotalRecords = this.Data.length;
        this.TotalPages = Math.floor(this.TotalRecords / this.PageSize);
        this.TotalPages += (this.TotalRecords % this.PageSize) > 0 ? 1 : 0;

    }
    
    //called by caller to fetch data
    public GetData = function (pageNo: number, pageSize: number,onDataCallback : any,postData : any) {

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

        this.IsFirstPage = this.CurrentPage === 1;
        this.IsLastPage = this.CurrentPage === this.TotalPages;

        let resultData: any = [];
        if (this.IsRemoteData) {
            if (this.AjaxConfig) {
                //ajax
                
                let conf = {
                    url: this.AjaxConfig.url,
                    type: this.AjaxConfig.type,
                    contentType: this.AjaxConfig.contentType,
                    beforeSend: this.AjaxConfig.beforeSend,
                    success: function (xhr,data) {
                        resultData = this.checkAndGetData(data);
                        if (this.onDataCallback) {
                            onDataCallback(resultData);
                        }
                    },
                    errorCallback: this.AjaxConfig.errorCallback,
                };
                let AjaxObj = new cAjax(conf);
                

                if (!cUtils.isFunction(postData)) {
                    postData = postData || {};
                    postData.start = startIndex;
                    postData.length = pageSize;
                    postData.columns = [this.SortedColumnName];
                    postData.order = [this.SortOrder];
                    AjaxObj.Call(postData);
                }
                else {
                    
                    AjaxObj.Call(postData, {
                        start : startIndex,
                        length : pageSize,
                        columns : [this.SortedColumnName],
                        order : [this.SortOrder]
                    });
                }
            }
            else {
                if (this.OnGetData) {
                    let data = this.OnGetData(this.CurrentPage, this.PageSize, this.SortedColumnName, this.SortOrder);
                    resultData = this.checkAndGetData(data);
                }
            }
        }
        else {
            resultData = (this.SortedData !== null && this.SortedData !== undefined) ? this.SortedData : this.Data;
            resultData = resultData.slice(startIndex, endIndex);
        }
        
        return resultData;
    }

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
        if (this.IsRemoteData)
            return;// do not sort remote data, its responsbility of remote data provider to provide sorted data as per parameter

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

