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
  mincolumns = [0,0,0,4,5,6,8,9,10,11];
  categories: Category[] = [];

  constructor(public dialog: MatDialog) {
    this.dataTable = [
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Apple Inc.", ticker:"appl", mgmtCompany: null, morningstarRating: "5 star", assetType: "Stock", assetClass1Name: "Large Cap", assetClass2Name: "Growth", assetClass3Name: "Technology", investorName: "Investor Name 1", acctNum: "127635417236", acctName: "Short Account Name 1", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123456", acctId: "123456", assetId: "CUSIPv 12345", assetClass1Id: "ACL1 ID 1", assetClass2Id: "ACL2 ID 1", assetClass3Id: "ACL3 ID 1" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Apple Inc.", ticker:"appl", mgmtCompany: null, morningstarRating: "5 star", assetType: "Stock", assetClass1Name: "Large Cap", assetClass2Name: "Growth", assetClass3Name: "Technology", investorName: "Investor Name 1", acctNum: "127635417237", acctName: "Short Account Name 2", combinedAccountName: "Lion Account", mgrName: "Blackrock", productName: "Lion Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123456", acctId: "123457", assetId: "CUSIPv 12345", assetClass1Id: "ACL1 ID 1", assetClass2Id: "ACL2 ID 1", assetClass3Id: "ACL3 ID 1" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Apple Inc.", ticker:"appl", mgmtCompany: null, morningstarRating: "5 star", assetType: "Stock", assetClass1Name: "Large Cap", assetClass2Name: "Growth", assetClass3Name: "Technology", investorName: "Investor Name 2", acctNum: "127635417236", acctName: "Short Account Name 1", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123457", acctId: "123456", assetId: "CUSIPv 12345", assetClass1Id: "ACL1 ID 1", assetClass2Id: "ACL2 ID 1", assetClass3Id: "ACL3 ID 1" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "Apple Inc.", ticker:"appl", mgmtCompany: null, morningstarRating: "5 star", assetType: "Stock", assetClass1Name: "Large Cap", assetClass2Name: "Growth", assetClass3Name: "Technology", investorName: "Investor Name 2", acctNum: "127635417237", acctName: "Short Account Name 2", combinedAccountName: "Lion Account", mgrName: "Blackrock", productName: "Lion Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123457", acctId: "123457", assetId: "CUSIPv 12345", assetClass1Id: "ACL1 ID 1", assetClass2Id: "ACL2 ID 1", assetClass3Id: "ACL3 ID 1" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "QQQ ETF", ticker:"QQQ", mgmtCompany: null, morningstarRating: "4 star", assetType: "ETF", assetClass1Name: "Index Fund", assetClass2Name: "Balanced", assetClass3Name: "Industry", investorName: "Investor Name 1", acctNum: "127635417236", acctName: "Short Account Name 1", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123456", acctId: "123456", assetId: "CUSIPv 12346", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 2", assetClass3Id: "ACL3 ID 3" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "QQQ ETF", ticker:"QQQ", mgmtCompany: null, morningstarRating: "4 star", assetType: "ETF", assetClass1Name: "Index Fund", assetClass2Name: "Balanced", assetClass3Name: "Industry", investorName: "Investor Name 1", acctNum: "127635417237", acctName: "Short Account Name 2", combinedAccountName: "Lion Account", mgrName: "Blackrock", productName: "Lion Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123456", acctId: "123457", assetId: "CUSIPv 12346", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 2", assetClass3Id: "ACL3 ID 3" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "QQQ ETF", ticker:"QQQ", mgmtCompany: null, morningstarRating: "4 star", assetType: "ETF", assetClass1Name: "Index Fund", assetClass2Name: "Balanced", assetClass3Name: "Industry", investorName: "Investor Name 2", acctNum: "127635417236", acctName: "Short Account Name 1", combinedAccountName: "Eagle Account", mgrName: "Blackrock", productName: "Eagle Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123457", acctId: "123456", assetId: "CUSIPv 12346", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 2", assetClass3Id: "ACL3 ID 3" },
      {quantity: 200, price: 25.56, value: 5112, ror: 12.5345365, yield: 2.56, percentageOfAccount: 25.45655, estimatedAnnualIncome: 400.00, unrealizedGainLoss: 3000.00, beginningValue: 4000.00, netContribution: 0, changeInValue: 1112.00, assetName: "QQQ ETF", ticker:"QQQ", mgmtCompany: null, morningstarRating: "4 star", assetType: "ETF", assetClass1Name: "Index Fund", assetClass2Name: "Balanced", assetClass3Name: "Industry", investorName: "Investor Name 2", acctNum: "127635417237", acctName: "Short Account Name 2", combinedAccountName: "Lion Account", mgrName: "Blackrock", productName: "Lion Account", style: "Growth", accountType: "Retail", taxStatus: "Post Tax", investorId: "123457", acctId: "123457", assetId: "CUSIPv 12346", assetClass1Id: "ACL1 ID 2", assetClass2Id: "ACL2 ID 2", assetClass3Id: "ACL3 ID 3" },
    ];
    this.params = {
      category1: "investor",
      category2: null,
      category3: null,
      category1Data: [],
      category2Data: [],
      category3Data: [],
      dataColumns: []
    };
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[11]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[23]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[0]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[1]);
    this.params.dataColumns.push(AvailableColumnOptions.columnOptions[2]);

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

  separateDataIntoCategories(){
    this.categories = [];
    if (this.params.category1 === null) {
      //Nocategories defined. So use full Data Table.
      return;
    }
    // console.log("Came to separate data");
    // Need to separate rows into categories
    // identify Primary column in data.
    let primaryColumn = this.identifyPrimaryColumn(this.params.category1);
    this.allocateRowsToCategory(this.dataTable, this.categories, primaryColumn);
    // console.log(this.categories);
    if (this.params.category2 !== null) {
      //need to further categorize.
      primaryColumn = this.identifyPrimaryColumn(this.params.category2);
      this.categories.forEach(category => {
        category.subCategories = [];
        this.allocateRowsToCategory(category.categoryData, category.subCategories, primaryColumn);
        if (this.params.category3 !== null) {
          //need to further categorize.
          primaryColumn = this.identifyPrimaryColumn(this.params.category3);
          category.subCategories.forEach(category2 => {
            category2.subCategories = [];
            this.allocateRowsToCategory(category2.categoryData, category2.subCategories, primaryColumn);        
          });
        }      
      });
    }
    // console.log(this.categories);
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
