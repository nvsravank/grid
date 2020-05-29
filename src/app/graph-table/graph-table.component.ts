import { Component, OnInit, Input, EventEmitter, OnDestroy } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-graph-table',
  templateUrl: './graph-table.component.html',
  styleUrls: ['./graph-table.component.scss']
})
export class GraphTableComponent implements OnInit, OnDestroy {
  vertical: boolean;
  selectOrientation: boolean;
  chartFirst: boolean;
  tooSmall: boolean;
  @Input()
  widget: GridsterItem;
  @Input()
  resizeEvent : EventEmitter<any>;
  @Input()
  portraitOrientation: boolean;
  resizeSub: Subscription;
  dataTable = [];

  constructor() {
    this.selectOrientation = false;
    this.vertical = true;
    this.chartFirst = true;
    this.tooSmall = false;
    this.dataTable = [
      {category: "Asset Category 1", value: "35,000,000.00", percentage: "35", performance: "2.00%", color:"#873B39"},
      {category: "Asset Category 2", value: "20,000,000.00", percentage: "20", performance: "3.00%", color:"#4A7C93"},
      {category: "Asset Category 3", value: "15,000,000.00", percentage: "15", performance: "1.00%", color:"#CEDADD"},
      {category: "Asset Category 4", value: "15,000,000.00", percentage: "15", performance: "3.00%", color:"#9C5954"},
      {category: "Asset Category 5", value: "8,000,000.00", percentage: "8", performance: "4.00%", color:"#D29989"},
      {category: "Asset Category Other", value: "7,000,000.00", percentage: "7", performance: "2.00%", color:"#356630"},
    ];
   }

   changeFirst() {
     this.chartFirst = !this.chartFirst;
   }

  changeOrientation() {
    if (this.changeOrientation) {
      this.vertical = !this.vertical;
    }
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
    if (this.widget.cols < 6) {
      // Cannot be vertical or horizontal.
      this.tooSmall = true;
    } else if(this.widget.cols < 8) {
      // Can still be vertical.
      if(this.widget.rows < 15) {
        // Too short for vertical.
        this.tooSmall = true;
      } else { 
        // Can be vertical.
        this.vertical = true;
        this.tooSmall = false;
        this.selectOrientation = false;
      }
    } else {
      //Can still be Horizontal.
      if (this.widget.rows < 11) {
        //Too short for horizontal
        this.tooSmall = true;
      } else if( this.widget.rows < 16 ) {
        // Good for Horizontal only
        this.vertical = false;
        this.tooSmall = false;
        this.selectOrientation = false;
      } else {
        //Can be horizontal or vertical.
        this.tooSmall = false;
        this.selectOrientation = true;
      }
    }

  }
  ngOnDestroy() {
    this.resizeSub.unsubscribe();
  }

}
