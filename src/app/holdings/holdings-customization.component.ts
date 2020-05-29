import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
export interface HoldingsCustomizationParameters {
  category1?: string;
  category2?: string;
  category3?: string;
  category1Data?: Array<DataColumn>;
  category2Data?: Array<DataColumn>;
  category3Data?: Array<DataColumn>;
  dataColumns?: Array<DataColumn>;
}

export class AvailableColumnOptions {
  static columnOptions: DataColumn[] = [
    {value: 'quantity', viewValue: 'Quantity', parentValue: "holding"},
    {value: 'price', viewValue: 'Price', parentValue: "holding"},
    {value: 'value', viewValue: 'Value', parentValue: "holding"},
    {value: 'ror', viewValue: 'Rate of Return', parentValue: "holding"},
    {value: 'yield', viewValue: 'Yield', parentValue: "holding"},
    {value: 'percentageOfAccount', viewValue: 'Percentage of Account', parentValue: "holding"},
    {value: 'estimatedAnnualIncome', viewValue: 'Estimated Annual Income', parentValue: "holding"},
    {value: 'unrealizedGainLoss', viewValue: 'Unrealized Gain / Loss', parentValue: "holding"},
    {value: 'beginningValue', viewValue: 'Beginning Value', parentValue: "holding"},
    {value: 'netContribution', viewValue: 'Net Contribution', parentValue: "holding"},
    {value: 'changeInValue', viewValue: 'Change In Value', parentValue: "holding"},
    {value: 'assetName', viewValue: 'Asset Name', parentValue: "asset"},
    {value: 'ticker', viewValue: 'Ticker Synbol', parentValue: "asset"},
    {value: 'mgmtCompany', viewValue: 'Management Company', parentValue: "asset"},
    {value: 'morningstarRating', viewValue: 'Morningstar Rating', parentValue: "asset"},
    {value: 'assetType', viewValue: 'Asset Type', parentValue: "asset"},
    {value: 'assetClass1Name', viewValue: 'ACL 1 Name', parentValue: "assetClass1"},
    {value: 'assetClass2Name', viewValue: 'ACL 2 Name', parentValue: "assetClass2"},
    {value: 'assetClass3Name', viewValue: 'ACL 3 Name', parentValue: "assetClass3"},
    {value: 'investorId', viewValue: 'Investor ID', parentValue: "investor"},
    {value: 'investorName', viewValue: 'Investor Name', parentValue: "investor"},
    {value: 'acctNum', viewValue: 'Account #', parentValue: "account"},
    {value: 'acctName', viewValue: 'Account Name', parentValue: "account"},
    {value: 'combinedAccountName', viewValue: 'Account Name / Manager / Style Name as applicable', parentValue: "account"},
    {value: 'mgrName', viewValue: 'Manager Name', parentValue: "account"},
    {value: 'productName', viewValue: 'Product Name', parentValue: "account"},
    {value: 'style', viewValue: 'Style', parentValue: "account"},
    {value: 'accountType', viewValue: 'Account Type', parentValue: "account"},
    {value: 'taxStatus', viewValue: 'Tax Status', parentValue: "account"},
  ];
}

export interface Selection {
  value: string;
  viewValue: string;
}

interface DataColumn extends Selection {
  parentValue?: string
}

@Component({
  selector: 'app-holdings-customization',
  templateUrl: './holdings-customization.component.html',
  styleUrls: ['./holdings-customization.component.scss']
})
export class HoldingsCustomizationComponent implements OnInit {
  categories: Selection[] = [
    {value: null, viewValue: 'No Category Selected'},
    {value: 'investor', viewValue: 'Investor'},
    {value: 'asset', viewValue: 'Asset Holdings'},
    {value: 'account', viewValue: 'Account'},
    {value: 'assetClass1', viewValue: 'Asset Classification 1'},
    {value: 'assetClass2', viewValue: 'Asset Classification 2'},
    {value: 'assetClass3', viewValue: 'Asset Classification 3'},
  ];

  columnOptions: Selection[] = [];
  investorAvailableDataColumns: DataColumn[] = [];
  assetAvailableDataColumns: DataColumn[] = [];
  accountAvailableDataColumns: DataColumn[] = [];
  assetClass1AvailableDataColumns: DataColumn[] = [];
  assetClass2AvailableDataColumns: DataColumn[] = [];
  assetClass3AvailableDataColumns: DataColumn[] = [];
  category1UnSelectedDataColumns: DataColumn[] = [];
  category2UnSelectedDataColumns: DataColumn[] = [];
  category3UnSelectedDataColumns: DataColumn[] = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  constructor(public dialogRef: MatDialogRef<HoldingsCustomizationComponent>,
    @Inject(MAT_DIALOG_DATA) public params: HoldingsCustomizationParameters) {
    // Setup the column options from previous selection.
    for (const option of AvailableColumnOptions.columnOptions) {
      let found = false;
      for (let index = 0; index < params.dataColumns.length; index++) {
        const element = params.dataColumns[index];
        if (element.value === option.value) {found = true;}
      }
      if (!found) {this.columnOptions.push(option); }
      // Setup columns for different grouping categories.
      switch (option.parentValue) {
        case "account":
          this.accountAvailableDataColumns.push(option);
        break;
        case "investor":
          this.investorAvailableDataColumns.push(option);
        break;
        case "asset":
          this.assetAvailableDataColumns.push(option);
        break;
        case "assetClass1":
          this.assetClass1AvailableDataColumns.push(option);
        break;
        case "assetClass2":
          this.assetClass2AvailableDataColumns.push(option);
        break;
        case "assetClass3":
          this.assetClass3AvailableDataColumns.push(option);
        break;
        default:
        break;
      }
    }
    // Available options and basic column option selection is complete. Now separate the available data columns based on the category selections and selected columsn for the category.
    this.setupandFixSelections();
    // console.log(this);
  }

  setupandFixSelections() {
    this.category1UnSelectedDataColumns = [];
    this.category2UnSelectedDataColumns = [];
    this.category3UnSelectedDataColumns = [];
    if(this.params.category1 === "account") {this.sortSelectedColumns(this.accountAvailableDataColumns, this.params.category1Data, this.category1UnSelectedDataColumns);}
    if(this.params.category2 === "account") {this.sortSelectedColumns(this.accountAvailableDataColumns, this.params.category2Data, this.category2UnSelectedDataColumns);}
    if(this.params.category3 === "account") {this.sortSelectedColumns(this.accountAvailableDataColumns, this.params.category3Data, this.category3UnSelectedDataColumns);}
    if(this.params.category1 === "investor") {this.sortSelectedColumns(this.investorAvailableDataColumns, this.params.category1Data, this.category1UnSelectedDataColumns);}
    if(this.params.category2 === "investor") {this.sortSelectedColumns(this.investorAvailableDataColumns, this.params.category2Data, this.category2UnSelectedDataColumns);}
    if(this.params.category3 === "investor") {this.sortSelectedColumns(this.investorAvailableDataColumns, this.params.category3Data, this.category3UnSelectedDataColumns);}
    if(this.params.category1 === "asset") {this.sortSelectedColumns(this.assetAvailableDataColumns, this.params.category1Data, this.category1UnSelectedDataColumns);}
    if(this.params.category2 === "asset") {this.sortSelectedColumns(this.assetAvailableDataColumns, this.params.category2Data, this.category2UnSelectedDataColumns);}
    if(this.params.category3 === "asset") {this.sortSelectedColumns(this.assetAvailableDataColumns, this.params.category3Data, this.category3UnSelectedDataColumns);}
    if(this.params.category1 === "assetClass1") {this.sortSelectedColumns(this.assetClass1AvailableDataColumns, this.params.category1Data, this.category1UnSelectedDataColumns);}
    if(this.params.category2 === "assetClass1") {this.sortSelectedColumns(this.assetClass1AvailableDataColumns, this.params.category2Data, this.category2UnSelectedDataColumns);}
    if(this.params.category3 === "assetClass1") {this.sortSelectedColumns(this.assetClass1AvailableDataColumns, this.params.category3Data, this.category3UnSelectedDataColumns);}
    if(this.params.category1 === "assetClass2") {this.sortSelectedColumns(this.assetClass2AvailableDataColumns, this.params.category1Data, this.category1UnSelectedDataColumns);}
    if(this.params.category2 === "assetClass2") {this.sortSelectedColumns(this.assetClass2AvailableDataColumns, this.params.category2Data, this.category2UnSelectedDataColumns);}
    if(this.params.category3 === "assetClass2") {this.sortSelectedColumns(this.assetClass2AvailableDataColumns, this.params.category3Data, this.category3UnSelectedDataColumns);}
    if(this.params.category1 === "assetClass3") {this.sortSelectedColumns(this.assetClass3AvailableDataColumns, this.params.category1Data, this.category1UnSelectedDataColumns);}
    if(this.params.category2 === "assetClass3") {this.sortSelectedColumns(this.assetClass3AvailableDataColumns, this.params.category2Data, this.category2UnSelectedDataColumns);}
    if(this.params.category3 === "assetClass3") {this.sortSelectedColumns(this.assetClass3AvailableDataColumns, this.params.category3Data, this.category3UnSelectedDataColumns);}
  }
  sortSelectedColumns(availableColumns: DataColumn[], selectedColumns: DataColumn[], unSelectedColumns: DataColumn[]) {
    for (let index = 0; index < availableColumns.length; index++) {
      const availableElement = availableColumns[index];
      let found=false;
      for (let index = 0; index < selectedColumns.length; index++) {
        const selectedElement = selectedColumns[index];
        if(availableElement.value === selectedElement.value) {found = true; }
      }
      if(!found) {unSelectedColumns.push(availableElement);}
    }
  }

  ngOnInit(): void {
    // console.log('The dialog is being opened with:' + JSON.stringify(this.params));

  }
  onNoClick(): void {
    // console.log('The dialog is being closed:' + JSON.stringify(this.params));
    this.dialogRef.close();
  }
  onChange1(){
    this.params.category1Data=[];
    this.category1UnSelectedDataColumns=[];
    this.onChange();
  }
  onChange2(){
    this.params.category2Data=[];
    this.category2UnSelectedDataColumns=[];
    this.onChange();
  }
  onChange3(){
    this.params.category3Data=[];
    this.category3UnSelectedDataColumns=[];
    this.onChange();
  }

  onChange(){
    if (this.params.category3 === this.params.category2) {
      //Category 2 was selected to be the same as category 3. So clean category 3 and move it's setting to category 2.
      this.params.category3 = null;
      this.params.category2Data = this.params.category3Data;
      this.params.category3Data = [];
    }
    if (this.params.category3 === this.params.category1) {
      //Category 1 was selected to be the same as category 3. So clean category 3 and move it's setting to category 1.
      this.params.category3 = null;
      this.params.category1Data = this.params.category3Data;
      this.params.category3Data = [];
    }
    if (this.params.category2 === this.params.category1) {
      //Category 1 was selected to be the same as category 2. So clean category 2 and move it's setting to category 1.
      this.params.category2 = null;
      this.params.category1Data = this.params.category2Data;
      this.params.category2Data = [];
    }
    if (this.params.category1 === null && this.params.category2 !== null) {
      // Category 1 is unselected after selecting category 2. So clean category 2 and move it's setting to category 1.
      this.params.category1 = this.params.category2;
      this.params.category2 = null;
      this.params.category1Data = this.params.category2Data;
      this.params.category2Data = [];
    }
    if (this.params.category2 === null && this.params.category3 !== null) {
      // Category 2 is unselected after selecting category 3. So clean category 3 and move it's setting to category 2.
      //This might happen in the previous if block since category 1 was unselected after selecting both 2 and 3.
      this.params.category2 = this.params.category3;
      this.params.category3 = null;
      this.params.category2Data = this.params.category3Data;
      this.params.category3Data = [];
    }
    this.setupandFixSelections();
  }

}
