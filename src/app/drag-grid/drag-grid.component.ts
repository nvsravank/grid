import {Component, OnInit, EventEmitter } from '@angular/core';

import {
  DisplayGrid,
  Draggable,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
  GridType
} from 'angular-gridster2';

interface Safe extends GridsterConfig {
  draggable: Draggable;
}

@Component({
  selector: 'app-drag-grid',
  templateUrl: './drag-grid.component.html',
  styleUrls: ['./drag-grid.component.scss'],
})
export class DragGridComponent implements OnInit {
  options: Safe;
  dashboard: Array<GridsterItem>;
  components: Array<GridsterItem>;
  customComponent: GridsterItem;
  headerHeight: number = 4;
  footerHeight: number = 3;
  portraitOrientation: boolean = false;
  gridBackgroundColor = "#01579b";
  gridWidth: number = 1100;
  gridHeight: number = 850;
  gridScale: number = 100;
  resizeEvent: EventEmitter<any> = new EventEmitter<any>();

  static eventStart(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) {
    console.info('eventStart', item, itemComponent, event);
  }

  static eventStop(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) {
    console.info('eventStop', item, itemComponent, event);
  }

  static overlapEvent(source: GridsterItem, target: GridsterItem, grid: GridsterComponent) {
    console.log('overlap', source, target, grid);
  }
  constructor() { }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      pushItems: false,
      swap: true,
      margin: 2,
      outerMargin: true,
      draggable: {
        delayStart: 0,
        enabled: true,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: false,
        dragHandleClass: 'drag-handler',
        stop: DragGridComponent.eventStop,
        start: DragGridComponent.eventStart,
        dropOverItems: false,
        dropOverItemsCallback: DragGridComponent.overlapEvent,
      },
      resizable: {
        enabled: true
      },
      itemResizeCallback: (item) => {
        // update DB with new size
        // send the update to widgets
        this.resizeEvent.emit(item);
      },
      minCols: 12,
      maxCols: 12,
      minRows: 30,
      maxRows: 30,
      maxItemCols: 12,
      minItemCols: 1,
      maxItemRows: 30,
      minItemRows: 1,
      maxItemArea: 300,
      minItemArea: 1,
      defaultItemCols: 3,
      defaultItemRows: 10
    };
    this.components = [
      {cols: 4, rows: 8, y: 0, x: 0, dragEnabled: true, minItemRows: 5, minItemCols: 4, label: 'Initial Rows = 8, Initial Columns = 4\nMinimum Rows = 5, Minimum Columns = 4', delete: true},
      {cols: 8, rows: 8, y: 0, x: 0, dragEnabled: true, minItemRows: 5, minItemCols: 8, label: 'Initial Rows = 8, Initial Columns = 8\nMinimum Rows = 5, Minimum Columns = 8', delete: true},
      {cols: 4, rows: 10, y: 0, x: 0, dragEnabled: true, maxItemRows: 10, maxItemCols: 6, label: 'Initial Rows = 10, Initial Columns = 4\nMaximum rows = 10, Maximum Columns = 6', delete: true},
      {cols: 2, rows: 2, y: 0, x: 0, dragEnabled: true, resizeEnabled: true, label: 'Initial Rows = 2, Initial Columns = 2\nDrag&Resize Enabled', delete: true},
      {cols: 2, rows: 2, y: 0, x: 0, dragEnabled: false, resizeEnabled: false, label: 'Initial Rows = 2, Initial Columns = 2\nDrag&Resize Disabled', delete: true},
      {cols: 2, rows: 2, y: 0, x: 0, dragEnabled: false, resizeEnabled: false, label: 'Initial Rows = 2, Initial Columns = 2\nDrag&Resize Disabled', delete: true},
      {cols: 8, rows: 11, y: 0, x: 0, hasContent: true,  dragEnabled: true, resizeEnabled: true, delete: true, label: 'Custom Graph and Table Component', type: "app-graph-table"},
    ];
    this.dashboard = [
      {cols: 12, rows: 4, y: 0, x: 0, dragEnabled: false, resizeEnabled: false, label: 'Header', delete: false},
      {cols: 12, rows: 3, y: 27, x: 0, dragEnabled: false, resizeEnabled: false, label: 'Footer', delete: false},
      {cols: 8, rows: 11, y: 3, x: 0, hasContent: true,  dragEnabled: true, resizeEnabled: true, delete: true, label: 'Custom Graph and Table Component', type: "app-graph-table"},
    ];
    this.customComponent = {
      x: 0,
      y: 0,
      cols: 3,
      rows: 3,
      minItemRows: 2,
      maxItemRows: 12,
      minItemCols: 2,
      maxItemCols: 12,
      label: 'Min rows & cols = 2',
      dragEnabled: true,
      resizeEnabled: true,
      delete: true
    };
    this.changedSettings();
  }

  changedSettings() {
    this.fixSettings(this.customComponent);
  }

  changedOptions() {
    this.fixOptions();
    this.dashboard[0].cols = this.options.minCols;
    this.dashboard[1].cols = this.options.minCols;
    this.dashboard[0].rows = this.headerHeight;
    this.dashboard[1].rows = this.footerHeight;
    this.dashboard[1].y = this.options.maxRows - this.footerHeight;
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
    this.fixSettings(this.customComponent);
    console.log(this.gridWidth, this.gridHeight);
  }
  changeOrientation(){
    let temp = this.gridHeight;
    this.gridHeight = this.gridWidth;
    this.gridWidth = temp;
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }
  changeScale() {
    let height = 850;
    let width = 1100;
    if (this.portraitOrientation) {
      height = 1100;
      width = 850;
    }
    this.gridHeight = height * this.gridScale / 100;
    this.gridWidth = width * this.gridScale / 100;
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }    
  }
  fixOptions() {
    //Not providing user options to set max columns and rows separately for now.
    this.options.maxCols = this.options.minCols;
    this.options.maxRows = this.options.minRows;
    if(this.options.minItemRows > this.options.minRows) {this.options.minItemRows = this.options.minRows; }
    if(this.options.minItemCols > this.options.minCols) {this.options.minItemCols = this.options.minCols; }
    if(this.options.maxItemRows > this.options.maxRows) {this.options.maxItemRows = this.options.maxRows; }
    if(this.options.maxItemCols > this.options.maxCols) {this.options.maxItemCols = this.options.maxCols; }
    if (this.options.maxItemCols < this.options.minItemCols) {this.options.maxItemCols = this.options.minItemCols; }
    if (this.options.maxItemRows < this.options.minItemRows) {this.options.maxItemRows = this.options.minItemRows; }
  }

  removeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }
  addDefinedItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    let newItem: GridsterItem = {cols: 0, rows: 0, y: 0, x: 0};
    newItem = Object.assign(newItem, item);
    this.dashboard.push(newItem);
  }

  fixSettings(item: GridsterItem) {
    //Check settings against grid settings and fix where applicable.
    if(item.minItemCols < this.options.minItemCols) {item.minItemCols = this.options.minItemCols; }
    if(item.minItemRows < this.options.minItemRows) {item.minItemRows = this.options.minItemRows; }
    if(item.maxItemCols > this.options.maxItemCols) {item.maxItemCols = this.options.maxItemCols; }
    if(item.maxItemRows > this.options.maxItemRows) {item.maxItemRows = this.options.maxItemRows; }

    // Check internal settings of the item.
    if(item.cols < 0) {item.cols = 0; }
    if(item.maxItemCols < item.minItemCols) {item.maxItemCols = item.minItemCols; }
    if(item.maxItemRows < item.minItemRows) {item.maxItemRows = item.minItemRows; }
    if(item.cols < item.minItemCols) {item.cols = item.minItemCols; }
    if(item.rows < item.minItemRows) {item.rows = item.minItemRows; }
    if(item.cols > item.maxItemCols) {item.cols = item.maxItemCols; }
    if(item.rows > item.maxItemRows) {item.rows = item.maxItemRows; }
    item.label = "Initial Rows = " + item.rows;
    item.label += ", Minimum Rows = " + item.minItemRows;
    item.label += ", Maximum Rows = " + item.maxItemRows;
    item.label += "\nInitial Columns = " + item.cols;
    item.label += ", Minimum Columns = " + item.minItemCols;
    item.label += ", Maximum Columns = " + item.maxItemCols;
    item.dragEnabled ? item.label += "\nDraggble" : item.label += "\nNot Draggble";
    item.resizeEnabled ? item.label += ", Resizable" : item.label += ", Not Resizable";
  }

  addItem() {
    let newItem: GridsterItem = {cols: this.options.minItemCols, rows: this.options.minItemRows, y: this.headerHeight, x: 0};
    newItem = Object.assign(newItem, this.customComponent);
    console.log(newItem);
    this.fixSettings(newItem)
    this.dashboard.push(newItem);
  }
}
