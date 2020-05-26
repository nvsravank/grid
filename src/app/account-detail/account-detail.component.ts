import { Component, OnInit, Input, EventEmitter, OnDestroy,  } from '@angular/core';
import { GridsterItem, GridsterConfig } from 'angular-gridster2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit, OnDestroy {
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
  dataTable = [];

  constructor() {
    this.dataTable = [
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
      {account: "US Equity", startDate: "9/7/10", value: "4,370.817", percentageOfTotal: 19.90, selectedPeriodPercentage: 9.99, yearToDatePercentage: 6.32, lastYearPercentage: 10.66, sinceStartDatePercentage: 9.99},
    ];
  }

  ngOnInit() {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) { // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        console.log("Old Size:\nRows: " + widget.rows + "\nColumns: " + widget.cols);
        setTimeout(this.sizing.bind(this), 1000);
      }
    });
    this.sizing();
  }
  sizing() {
    console.log("New Size:\nRows: " + this.widget.rows + "\nColumns: " + this.widget.cols);
    if(!this.gridOptions) {
      this.tooSmall = true;
      return;
    }
    const y = this.gridOptions.maxRows - this.footerHeight - this.widget.rows;
    console.log("Settings\nGrid Max Rows: " + this.gridOptions.maxRows + "\nFooter Height: " + this.footerHeight + "\nWidget Rows: " + this.widget.rows + "\nCalculated Y: " + y + "\nActual Y: " + this.widget.y);
    if(y !== this.widget.y) {
      this.atEnd = false;
      return;
    }
    this.atEnd = true;
  }
  ngOnDestroy() {
    this.resizeSub.unsubscribe();
  }
}
