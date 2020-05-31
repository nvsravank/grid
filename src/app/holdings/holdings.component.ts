import { Component, OnInit, Input, EventEmitter, OnDestroy,  } from '@angular/core';
import { GridsterItem, GridsterConfig } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { HoldingsCustomizationComponent, HoldingsCustomizationParameters, AvailableColumnOptions } from './holdings-customization.component';

class Category {
  categoryId: string;
  categoryPrimaryKey: any;
  subCategories: Category[] = [];
  categoryData = [];
  summaryData = {};
}
@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.scss']
})
export class HoldingsComponent implements OnInit, OnDestroy {
  tooSmall: boolean = false;
  atEnd: boolean = false;
  @Input()
  widget: GridsterItem;
  @Input()
  resizeEvent : EventEmitter<any>;
  @Input()
  portraitOrientation: boolean;
  @Input()
  gridOptions: GridsterConfig;
  @Input()
  footerHeight: number;
  resizeSub: Subscription;
  params: HoldingsCustomizationParameters;
  dataTable = [];
  dataSet1 = [];
  dataSet2 = [];
  mincolumns = [0,0,0,4,5,6,8,9,10,11];
  categories: Category[] = [];
  uncategorized: Category = {
    categoryId: "",
    categoryPrimaryKey: "",
    categoryData: [],
    subCategories: [],
    summaryData: {}
  };
  valueColumnIndex: number = 0;

  constructor(public dialog: MatDialog) {
    this.params = {
      category1: "investor",
      category2: "account",
      category3: "assetClass1",
      category1Data: [],
      category2Data: [],
      category3Data: [],
      dataColumns: []
    };
    // Dummy data setup.
    this.dataSet1 = [
      {quantity: 7318.06, price: 1.00, value: 7318.06, ror: 12.534, yield: 0   , percentageOfAccount: 0.31, estimatedAnnualIncome: 0,      unrealizedGainLoss: 0,        cost: 0,        beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Brokerage Money Market", ticker:"", mgmtCompany: null, morningstarRating: "5 star", assetType: "Stock", assetClass1Name: "Cash or Equivalents", assetClass2Name: "Growth", assetClass3Name: "Technology", investorName: "Sample Investor", acctNum: "03004721 000", acctName: "The Oliver Wendell", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Giftc Custodial IRA", taxStatus: "Post Tax", investorId: "123456", acctId: "123456", assetId: "CUSIPv 12345", assetClass1Id: "ACL1 ID 1", assetClass2Id: "ACL2 ID 1", assetClass3Id: "ACL3 ID 1" },
      {quantity: 600, price: 50.94, value:  30564, ror: 12.5345365, yield: 1.88, percentageOfAccount: 1.29, estimatedAnnualIncome: 576.00, unrealizedGainLoss: 14534.99, cost: 16029.01, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Abbot Laboratories", ticker:"abt", mgmtCompany: null, morningstarRating: "4 star", assetType: "Mutual Fund", assetClass1Name: "Mutual Fund", assetClass2Name: "Growth", assetClass3Name: "Technology", investorName: "Sample Investor", acctNum: "03004721 000", acctName: "The Oliver Wendell", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Giftc Custodial IRA", taxStatus: "Post Tax", investorId: "123456", acctId: "123456", assetId: "CUSIPv 12346", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 1", assetClass3Id: "ACL3 ID 1" },
      {quantity: 200, price:132.82, value:  26564, ror: 12.5345365, yield: 2.44, percentageOfAccount: 1.12, estimatedAnnualIncome: 648.00, unrealizedGainLoss: 12219.86, cost: 14344.14, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Air Products & chemicals Inc", ticker:"apd", mgmtCompany: null, morningstarRating: "4 star", assetType: "Mutual Fund", assetClass1Name: "Mutual Fund", assetClass2Name: "Growth", assetClass3Name: "Technology", investorName: "Sample Investor", acctNum: "03004721 000", acctName: "The Oliver Wendell", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Giftc Custodial IRA", taxStatus: "Post Tax", investorId: "123456", acctId: "123456", assetId: "CUSIPv 12347", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 1", assetClass3Id: "ACL3 ID 1" },
      {quantity: 500, price: 29.36, value:  14680, ror: 12.5345365, yield: 2.04, percentageOfAccount: 0.62, estimatedAnnualIncome: 300.00, unrealizedGainLoss:  1096.30, cost: 13583.70, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Allison Transmission HLDGS Inc.", ticker:"alsn", mgmtCompany: null, morningstarRating: "4 star", assetType: "Mutual Fund", assetClass1Name: "Mutual Fund", assetClass2Name: "Growth", assetClass3Name: "Technology", investorName: "Sample Investor", acctNum: "03004721 000", acctName: "The Oliver Wendell", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Giftc Custodial IRA", taxStatus: "Post Tax", investorId: "123456", acctId: "123456", assetId: "CUSIPv 12348", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 1", assetClass3Id: "ACL3 ID 1" },
      {quantity:1000, price:  8.54, value:  8540 , ror: 12.5345365, yield: 2.43, percentageOfAccount: 0.36, estimatedAnnualIncome: 125.43, unrealizedGainLoss: -2182.30, cost: 10722.30, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Apigee Corp", ticker:"apic", mgmtCompany: null, morningstarRating: "4 star", assetType: "Mutual Fund", assetClass1Name: "Mutual Fund", assetClass2Name: "Balanced", assetClass3Name: "Industry", investorName: "Sample Investor", acctNum: "03004721 000", acctName: "The Oliver Wendell", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Giftc Custodial IRA", taxStatus: "Post Tax", investorId: "123456", acctId: "123456", assetId: "CUSIPv 12349", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 2", assetClass3Id: "ACL3 ID 3" },
      {quantity: 280, price:123.38, value:34546.4, ror: 12.5345365, yield: 1.69, percentageOfAccount: 1.46, estimatedAnnualIncome: 582.40, unrealizedGainLoss: 13549.60, cost: 20996.80, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "apple inc", ticker:"aapl", mgmtCompany: null, morningstarRating: "4 star", assetType: "Mutual Fund", assetClass1Name: "Mutual Fund", assetClass2Name: "Balanced", assetClass3Name: "Industry", investorName: "Sample Investor", acctNum: "03004721 000", acctName: "The Oliver Wendell", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Giftc Custodial IRA", taxStatus: "Post Tax", investorId: "123456", acctId: "123456", assetId: "CUSIPv 12340", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 2", assetClass3Id: "ACL3 ID 3" },
      {quantity: 400, price: 54.76, value:  21904, ror: 12.5345365, yield: 2.44, percentageOfAccount: 0.92, estimatedAnnualIncome: 306.00, unrealizedGainLoss:   297.08, cost: 21606.92, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Armstrong World Industries Inc New", ticker:"awi", mgmtCompany: null, morningstarRating: "4 star", assetType: "Mutual Fund", assetClass1Name: "Mutual Fund", assetClass2Name: "Balanced", assetClass3Name: "Industry", investorName: "Sample Investor", acctNum: "03004721 000", acctName: "The Oliver Wendell", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Giftc Custodial IRA", taxStatus: "Post Tax", investorId: "123456", acctId: "123456", assetId: "CUSIPv 12341", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 2", assetClass3Id: "ACL3 ID 3" },
      {quantity: 200, price: 80.58, value:  16116, ror: 12.5345365, yield: 2.43, percentageOfAccount: 0.68, estimatedAnnualIncome: 392.00, unrealizedGainLoss:  9829.22, cost: 16116.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Automatic Data Processing Inc", ticker:"adp", mgmtCompany: null, morningstarRating: "4 star", assetType: "Mutual Fund", assetClass1Name: "Mutual Fund", assetClass2Name: "Balanced", assetClass3Name: "Industry", investorName: "Sample Investor", acctNum: "03004721 000", acctName: "The Oliver Wendell", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Giftc Custodial IRA", taxStatus: "Post Tax", investorId: "123456", acctId: "123456", assetId: "CUSIPv 12342", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 2", assetClass3Id: "ACL3 ID 3" },
    ];
    this.dataSet2 = [
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, cost: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Apple Inc.", ticker:"appl", mgmtCompany: null, morningstarRating: "5 star", assetType: "Stock", assetClass1Name: "Large Cap", assetClass2Name: "Growth", assetClass3Name: "Technology", investorName: "Investor Name 1", acctNum: "127635417236", acctName: "Short Account Name 1", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123456", acctId: "123456", assetId: "CUSIPv 12345", assetClass1Id: "ACL1 ID 1", assetClass2Id: "ACL2 ID 1", assetClass3Id: "ACL3 ID 1" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, cost: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Apple Inc.", ticker:"appl", mgmtCompany: null, morningstarRating: "5 star", assetType: "Stock", assetClass1Name: "Large Cap", assetClass2Name: "Growth", assetClass3Name: "Technology", investorName: "Investor Name 1", acctNum: "127635417237", acctName: "Short Account Name 2", combinedAccountName: "Lion Account", mgrName: "Blackrock", productName: "Lion Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123456", acctId: "123457", assetId: "CUSIPv 12345", assetClass1Id: "ACL1 ID 1", assetClass2Id: "ACL2 ID 1", assetClass3Id: "ACL3 ID 1" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, cost: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Apple Inc.", ticker:"appl", mgmtCompany: null, morningstarRating: "5 star", assetType: "Stock", assetClass1Name: "Large Cap", assetClass2Name: "Growth", assetClass3Name: "Technology", investorName: "Investor Name 2", acctNum: "127635417236", acctName: "Short Account Name 1", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123457", acctId: "123456", assetId: "CUSIPv 12345", assetClass1Id: "ACL1 ID 1", assetClass2Id: "ACL2 ID 1", assetClass3Id: "ACL3 ID 1" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, cost: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Apple Inc.", ticker:"appl", mgmtCompany: null, morningstarRating: "5 star", assetType: "Stock", assetClass1Name: "Large Cap", assetClass2Name: "Growth", assetClass3Name: "Technology", investorName: "Investor Name 2", acctNum: "127635417237", acctName: "Short Account Name 2", combinedAccountName: "Lion Account", mgrName: "Blackrock", productName: "Lion Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123457", acctId: "123457", assetId: "CUSIPv 12345", assetClass1Id: "ACL1 ID 1", assetClass2Id: "ACL2 ID 1", assetClass3Id: "ACL3 ID 1" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, cost: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "QQQ ETF", ticker:"QQQ", mgmtCompany: null, morningstarRating: "4 star", assetType: "ETF", assetClass1Name: "Index Fund", assetClass2Name: "Balanced", assetClass3Name: "Industry", investorName: "Investor Name 1", acctNum: "127635417236", acctName: "Short Account Name 1", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123456", acctId: "123456", assetId: "CUSIPv 12346", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 2", assetClass3Id: "ACL3 ID 3" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, cost: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "QQQ ETF", ticker:"QQQ", mgmtCompany: null, morningstarRating: "4 star", assetType: "ETF", assetClass1Name: "Index Fund", assetClass2Name: "Balanced", assetClass3Name: "Industry", investorName: "Investor Name 1", acctNum: "127635417237", acctName: "Short Account Name 2", combinedAccountName: "Lion Account", mgrName: "Blackrock", productName: "Lion Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123456", acctId: "123457", assetId: "CUSIPv 12346", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 2", assetClass3Id: "ACL3 ID 3" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, cost: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "QQQ ETF", ticker:"QQQ", mgmtCompany: null, morningstarRating: "4 star", assetType: "ETF", assetClass1Name: "Index Fund", assetClass2Name: "Balanced", assetClass3Name: "Industry", investorName: "Investor Name 2", acctNum: "127635417236", acctName: "Short Account Name 1", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123457", acctId: "123456", assetId: "CUSIPv 12346", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 2", assetClass3Id: "ACL3 ID 3" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, cost: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "QQQ ETF", ticker:"QQQ", mgmtCompany: null, morningstarRating: "4 star", assetType: "ETF", assetClass1Name: "Index Fund", assetClass2Name: "Balanced", assetClass3Name: "Industry", investorName: "Investor Name 2", acctNum: "127635417237", acctName: "Short Account Name 2", combinedAccountName: "Lion Account", mgrName: "Blackrock", productName: "Lion Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123457", acctId: "123457", assetId: "CUSIPv 12346", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 2", assetClass3Id: "ACL3 ID 3" },
    ];
    this.dataTable = this.dataSet1;
    // Dummy data setup complete.

    // Starting default configuration being loadeed. If configuration is loaded from server, you need to find the right objects from Available Column Options to use it properly.
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[12]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[13]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[5]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[0]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[1]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[2]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[7]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[8]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[4]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[6]);

    this.params.category1Data.push(AvailableColumnOptions.columnOptions[21]);
    this.params.category2Data.push(AvailableColumnOptions.columnOptions[23]);
    this.params.category2Data.push(AvailableColumnOptions.columnOptions[22]);
    this.params.category2Data.push(AvailableColumnOptions.columnOptions[28]);
    this.params.category3Data.push(AvailableColumnOptions.columnOptions[17]);
    // End default configuration.

    // Setup the categories and the data for the categories based on the parameters. This eneds to be done every time ther eis a change in parameters.
    this.separateDataIntoCategories();
  }

  setDataSet1(){
    this.dataTable = this.dataSet1;
    this.separateDataIntoCategories();
  }

  setDataSet2(){
    this.dataTable = this.dataSet2;
    this.separateDataIntoCategories();
  }

  ngOnInit() {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) { // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        // console.log("Old Size:\nRows: " + widget.rows + "\nColumns: " + widget.cols);
        setTimeout(this.sizing.bind(this), 1000);
      }
    });
    this.sizing();
  }
  sizing() {
    // console.log("New Size:\nRows: " + this.widget.rows + "\nColumns: " + this.widget.cols);
    if(!this.gridOptions || this.widget.cols < 3) {
      this.tooSmall = true;
      return;
    }
    this.tooSmall = false;
    const y = this.gridOptions.maxRows - this.footerHeight - this.widget.rows;
    // console.log("Settings\nGrid Max Rows: " + this.gridOptions.maxRows + "\nFooter Height: " + this.footerHeight + "\nWidget Rows: " + this.widget.rows + "\nCalculated Y: " + y + "\nActual Y: " + this.widget.y);
    if(y !== this.widget.y) {
      this.atEnd = false;
      return;
    }
    this.atEnd = true;
  }
  ngOnDestroy() {
    this.resizeSub.unsubscribe();
  }
  openDialog(): void {
    const doc = document.documentElement;
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    if (top != 0 || left != 0) {
      window.scrollTo({
        top : 0,
        left: 0
      });
    }
    const newParams: HoldingsCustomizationParameters = {
      category1: this.params.category1,
      category2: this.params.category2,
      category3: this.params.category3,
      category1Data: [...this.params.category1Data],
      category2Data: [...this.params.category2Data],
      category3Data: [...this.params.category3Data],
      dataColumns: [...this.params.dataColumns]
    };
    const dialogRef = this.dialog.open(HoldingsCustomizationComponent, {
      disableClose: true,
      width: '1100px',
      data: newParams
    });
    dialogRef.afterClosed().subscribe(result => {
      // Result is only sent when user does not click cancel.
      if (top != 0 || left != 0) {
        window.scroll({
          top : top,
          left : left
        });
      }
      if(result) {
        this.params = {...result};
        this.params.dataColumns = [...result.dataColumns]
        this.separateDataIntoCategories();
        // console.log(this.params);
      }
    });
  }

  setValueColumnIndex(){
    let found = false;
    this.valueColumnIndex = 0;
    // console.log(this.valueColumnIndex);
    for (let index = 0; index < this.params.dataColumns.length && !found; index++) {
      const element = this.params.dataColumns[index];
      if (element.value === "value") {
        found = true;
        this.valueColumnIndex = index;
      }
    }
    // console.log(this.valueColumnIndex);
  }

  separateDataIntoCategories(){
    this.setValueColumnIndex();
    this.categories = [];
    if (this.params.category1 === null) {
      //Nocategories defined. So use full Data Table.
      this.uncategorized.categoryData = this.dataTable;
      this.calculateSummaryData(this.uncategorized);
      return;
    }
    // Need to separate rows into categories
    // identify Primary column in data.
    let primaryColumn = this.identifyPrimaryColumn(this.params.category1);
    this.allocateRowsToCategory(this.dataTable, this.categories, primaryColumn);
    this.categories.forEach(category1 => {
      this.calculateSummaryData(category1);
      if (this.params.category2 !== null) {
        //need to further categorize.
        primaryColumn = this.identifyPrimaryColumn(this.params.category2);
        category1.subCategories = [];
        this.allocateRowsToCategory(category1.categoryData, category1.subCategories, primaryColumn);
        category1.subCategories.forEach(category2 => {
          this.calculateSummaryData(category2);
          if (this.params.category3 !== null) {
            //need to further categorize.
            primaryColumn = this.identifyPrimaryColumn(this.params.category3);
            category2.subCategories = [];
            this.allocateRowsToCategory(category2.categoryData, category2.subCategories, primaryColumn);        
            category2.subCategories.forEach(category3 => {
              this.calculateSummaryData(category3);
            });
          }  
        });
      }  
    });
    // console.log(this.categories);
  }

  calculateSummaryData(category: Category) {
    category.summaryData = {};
    this.params.dataColumns.forEach(column => {
      if(column.isNumber && column.isAdditive) {
        let sum = 0;
        for (let index = 0; index < category.categoryData.length; index++) {
          const row = category.categoryData[index];
          sum = sum + (+row[column.value]);
        }
        if (isNaN(sum)) { sum=0;}
        category.summaryData[column.value] = sum;
      }
    });
  }

  allocateRowsToCategory(dataSet: any[], categories: Category[], primaryColumn: string){
    dataSet.forEach(row => {
      const primaryKey = row[primaryColumn];
      if(primaryKey === null) {return;} // Ignore row as it cannot be categorized.
      let found = false;
      for (let index = 0; index < categories.length; index++) {
        const category = categories[index];
        if(category.categoryPrimaryKey === primaryKey) {
          found = true;
          category.categoryData.push(row);
        }
      }
      if (!found) {
        let newCategory: Category = new Category();
        newCategory.categoryId = primaryColumn;
        newCategory.categoryPrimaryKey = primaryKey;
        newCategory.categoryData = [row];
        categories.push(newCategory);
      }
    });
  }

  identifyPrimaryColumn(category: string) {
    let primaryColumn = null;
    switch (category) {
      case "account":
        primaryColumn = "acctId";
      break;
      case "investor":
        primaryColumn = "investorId";
      break;
      case "asset":
        primaryColumn = "assetId";
      break;
      case "assetClass1":
        primaryColumn = "assetClass1Id";
      break;
      case "assetClass2":
        primaryColumn = "assetClass2Id";
      break;
      case "assetClass3":
        primaryColumn = "acctClass3Id";
      break;
      default:
      break;
    }
    return primaryColumn;
  }
}
