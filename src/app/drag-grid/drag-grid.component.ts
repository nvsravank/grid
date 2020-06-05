import {Component, OnInit, EventEmitter } from '@angular/core';
import { GraphTableComponent } from '../graph-table/graph-table.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AccountDetailComponent } from '../account-detail/account-detail.component';
import { HoldingsComponent } from '../holdings/holdings.component';
import { GraphComponent } from '../graph/graph.component';

import {
  DisplayGrid,
  Draggable,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
  GridType,
  CompactType
} from 'angular-gridster2';
import { isArray, isUndefined } from 'util';
import { isNgTemplate } from '@angular/compiler';

interface Safe extends GridsterConfig {
  draggable: Draggable;
}

class Group{
  groupType: string;
  item: GridsterItem;
  subGroups: Array<Group>;
  starting: number;
  length: number;
  ending: number;
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
  columnLayout: boolean = true;
  rowLayout: boolean = true;
  singleComponent: boolean = false;
  columnLayoutSelected: boolean = false;
  errorLayout: boolean = false;
  autoLayout() {
    this.errorLayout = false;
    if (!this.dashboard || !this.dashboard.length || this.dashboard.length < 3) {return; }// Error handling.
    // if (!this.columnLayout && !this.rowLayout) {return; }// Cannot Layout bad layouts.
    if (this.dashboard.length === 3) { // Single Component. Size it fully.
      this.dashboard[2].x = 0;
      this.dashboard[2].y = this.headerHeight;
      this.dashboard[2].cols = this.options.maxCols;
      this.dashboard[2].rows = this.options.maxRows - this.headerHeight - this.footerHeight;
      return;
    }
    const initialGroup = new Group();
    initialGroup.groupType = !this.columnLayoutSelected ? "column" : "row";
    initialGroup.subGroups = new Array<Group>();
    for (let index = 2; index < this.dashboard.length; index++) {
      const item = this.dashboard[index];
      const element:Group = {
        item: item,
        groupType: null,
        subGroups: [],
        starting:  (initialGroup.groupType === "row")? item.x             : item.y,
        length:    (initialGroup.groupType === "row")? item.cols          : item.rows,
        ending:    (initialGroup.groupType === "row")? item.x + item.cols : item.y + item.rows
      };
      initialGroup.subGroups.push(element);
    }
    try {
      let subGroups = this.combineSubGroupsAndCreateOppositeType(initialGroup);
      if(subGroups !== null) {
        initialGroup.subGroups = subGroups;
        for (let index = 0; index < initialGroup.subGroups.length; index++) {
          subGroups = null;
          const subgroup = initialGroup.subGroups[index];
          subGroups = this.combineSubGroupsAndCreateOppositeType(subgroup);
          if (subGroups !== null) {
            if(isArray(subGroups)) {
              subgroup.subGroups = subGroups;
            }
          }
        }
      }
      this.printGroup(initialGroup);      
    } catch (error) {
      this.errorLayout = true;
      return;
    }
  }

  printGroup(group: Group) {
    if(group.hasOwnProperty("item") && group.item !== null) {
      console.log("Item:");
      console.log("x       :" + group.item.x    + ", y   : " + group.item.y   );
      console.log("Columns :" + group.item.cols + ", Rows: " + group.item.rows);
      return;
    }
    if (!isUndefined(group.starting)) {
      console.log("Group Of : " + group.groupType);
      console.log("Start    : " + group.starting);
      console.log("Length   : " + group.length  );
      console.log("Ending   : " + group.ending  );
    }
    if (group.subGroups.length === 0) {return;}
    for (let index = 0; index < group.subGroups.length; index++) {
      const element = group.subGroups[index];
      // console.log(element);
      if (! isUndefined(element)) {
        this.printGroup(element);
      }
    }
  }

  combineSubGroupsAndCreateOppositeType(group: Group) {
    if(isUndefined( group.subGroups) || !isArray( group.subGroups) || group.groupType === null ) {return null; }// Error hangling. Nothing to do. If item is set, then i tis not a group. Never set the item property in this logic.
    // if(group.subGroups.length < 3) {return null;} // No need to group 2 items.
    let newSubgroups = new Array<Group>();
    for (let index = 0; index < group.subGroups.length; index++) {
      const itemGroup = group.subGroups[index];
      if (isUndefined(itemGroup)) {break;}
      let found = false;
      for (let index2 = 0; index2 < newSubgroups.length; index2++) {
        const groupToCompare = newSubgroups[index2];
        if (itemGroup.starting >=  groupToCompare.starting && itemGroup.ending <= groupToCompare.ending) { found = true;} // group found is larger than item.
        else if (itemGroup.starting <=  groupToCompare.starting && itemGroup.ending >= groupToCompare.ending) { //Group found is smaller than item.
          found = true;
          groupToCompare.starting = itemGroup.starting;
          groupToCompare.ending = itemGroup.ending;
          groupToCompare.length = itemGroup.length;
        }
        if (found) {
          groupToCompare.subGroups.push(itemGroup);
          break;
        }
      }
      if(!found) {
        const newSubGroup: Group = {
          item: null,
          groupType: (group.groupType === "column"? "row" : "column"),
          subGroups: [itemGroup],
          starting: itemGroup.starting,
          length: itemGroup.length,
          ending: itemGroup.ending  
        };
        newSubgroups.push(newSubGroup);
      }
    }
    //Retrun if only one sub group found.
    if (newSubgroups.length === 1) {return null;}
    if (newSubgroups.length === group.subGroups.length) {return newSubgroups;}
    // Check for issues in subgroups.
    let issueFound = false;
    for (let index1 = 0; index1 < newSubgroups.length - 1; index1++) {
      const element1 = newSubgroups[index1];
      for (let index2 = index1+1; index2 < newSubgroups.length; index2++) {
        const element2 = newSubgroups[index2];
        if (element1.starting < element2.starting && element1.ending > element2.starting) {issueFound = true; break;}
        if (element1.starting > element2.starting && element1.starting < element2.ending) {issueFound = true; break;}
      }
      if(issueFound) {break; }  
    }
    if(issueFound) { throw "Error"; }
    else {
      for (const newSubGroup of newSubgroups) {
        for(const itemGroup of newSubGroup.subGroups) {
          itemGroup.starting  = (newSubGroup.groupType === "row")? itemGroup.item.x                       : itemGroup.item.y;
          itemGroup.length    = (newSubGroup.groupType === "row")? itemGroup.item.cols                    : itemGroup.item.rows;
          itemGroup.ending    = (newSubGroup.groupType === "row")? itemGroup.item.x + itemGroup.item.cols : itemGroup.item.y + itemGroup.item.rows;
        }
      }
      return newSubgroups; 
    }
  }

  checkLayout(){
    // console.log("Came to check layout");
    this.dashboard.length === 3? this.singleComponent = true : this.singleComponent = false;
    this.columnLayoutCheck();
    this.rowLayoutCheck();
    if (this.columnLayout && !this.rowLayout) {this.columnLayoutSelected = true; }
    if (!this.columnLayout && this.rowLayout) {this.columnLayoutSelected = false; }
    if (this.singleComponent || (!this.columnLayout && !this.rowLayout)) {this.resetColor(); }
    else if (this.columnLayout && !this.rowLayout) {this.columnColor(); }
    else if (!this.columnLayout && this.rowLayout) {this.rowColor(); }
    else if (this.columnLayoutSelected) {this.columnColor(); }
    else  {this.rowColor(); }
  }
  rowColor() {
    let rows = {};
    //organize widgets into columns based on starting x positions.
    if (this.dashboard.length <= 3) {return; }
    for (let index = 2; index < this.dashboard.length; index++) {
      const item = this.dashboard[index];
      if (rows.hasOwnProperty(item.y) && isArray(rows[item.y])) {rows[item.y].push(item); }
      else {rows[item.y] = [item]; }
    }
    let keys = Object.keys(rows);
    keys = keys.sort(this.numberCompare);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const color1='#DDDDDD';
      const color2='#FFFFFF';
      for (let index2 = 0; index2 < rows[key].length; index2++) {
        const item = rows[key][index2];
        if (index % 2 === 0) {
          item.backgroundColor = color1;
        } else {
          item.backgroundColor = color2;
        }
        // console.log(item.x, item.y);
      }      
    }

  }
  numberCompare(a: any, b: any) {
    let result = 0;
    if (+a < +b) result = -1;
    if (+a > +b) result = +1;
    return result;
  }
  columnColor() {
    let columns = {};
    //organize widgets into columns based on starting x positions.
    if (this.dashboard.length <= 3) {return; }
    for (let index = 2; index < this.dashboard.length; index++) {
      const item = this.dashboard[index];
      if (columns.hasOwnProperty(item.x) && isArray(columns[item.x])) {columns[item.x].push(item); }
      else {columns[item.x] = [item]; }
    }
    let keys = Object.keys(columns);
    keys = keys.sort();
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const color1='#DDDDDD';
      const color2='#FFFFFF';
      for (let index2 = 0; index2 < columns[key].length; index2++) {
        const item = columns[key][index2];
        if (index % 2 === 0) {
          item.backgroundColor = color1;
        } else {
          item.backgroundColor = color2;
        }
        console.log(item.x, item.y);
      }
    }
  }

  resetColor(){
    for (let index = 0; index < this.dashboard.length; index++) {
      const item = this.dashboard[index];
      item.backgroundColor = '#FFFFFF';
    }
  }
  changeLayout() {
    this.columnLayoutSelected = !this.columnLayoutSelected;
  }

  columnLayoutCheck() {
    this.columnLayout = true;
    let columns = {};
    //organize widgets into columns based on starting x positions.
    if (this.dashboard.length <= 2) {return; }
    for (let index = 2; index < this.dashboard.length; index++) {
      const item = this.dashboard[index];
      for (let index2 = 2; index2 < this.dashboard.length; index2++) {
        const item2 = this.dashboard[index2];
        if (item.x !== item2.x && item.x < item2.x && ((item.x + item.cols) > item2.x)) {
          this.columnLayout = false;
          return;
        }
      }
      if (columns.hasOwnProperty(item.x) && isArray(columns[item.x])) {columns[item.x].push(item); }
      else {columns[item.x] = [item]; }
    }
    for (const key in columns) {
      if (columns.hasOwnProperty(key)) {
        const column = columns[key];
        if (isArray(column) && column.length !==0 ) {
          const width = column[0].cols;
          for (let index = 0; index < column.length; index++) {
            const item = column[index];
            if (item.cols !== width) {
              this.columnLayout = false;
              return;
            }
          }
        }
      }
    }
    // console.log("Is this Column Layout? " + this.columnLayout);
  }

  rowLayoutCheck() {
    this.rowLayout = true;
    let rows = {};
    //organize widgets into columns based on starting x positions.
    if (this.dashboard.length <= 2) {return; }
    for (let index = 2; index < this.dashboard.length; index++) {
      const item = this.dashboard[index];
      for (let index2 = 2; index2 < this.dashboard.length; index2++) {
        const item2 = this.dashboard[index2];
        if (item.y !== item2.y && item.y < item2.y && ((item.y + item.rows) > item2.y)) {
          this.rowLayout = false;
          return;
        }
      }
      if (rows.hasOwnProperty(item.y) && isArray(rows[item.y])) {rows[item.y].push(item); }
      else {rows[item.y] = [item]; }
    }
    for (const key in rows) {
      if (rows.hasOwnProperty(key)) {
        const row = rows[key];
        if (isArray(row) && row.length !==0 ) {
          const height = row[0].rows;
          for (let index = 0; index < row.length; index++) {
            const item = row[index];
            if (item.rows !== height) {
              this.rowLayout = false;
              break;
            }
          }
        }
      }
    }
    // console.log("Is this Row Layout? " + this.rowLayout);
  }

  static eventStart(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) {
    console.info('eventStart', item, itemComponent, event);
  }

  static overlapEvent(source: GridsterItem, target: GridsterItem, grid: GridsterComponent) {
    console.log('overlap', source, target, grid);
  }
  constructor() { }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      compactType: CompactType.None,
      pushItems: false,
      disableWarnings: true,
      swap: true,
      margin: 2,
      outerMargin: true,
      draggable: {
        delayStart: 0,
        enabled: true,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: false,
        dragHandleClass: 'drag-handler',
        stop: (item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) => {this.resizeEvent.emit(item);setTimeout(this.checkLayout.bind(this), 1000);},
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
        setTimeout(this.checkLayout.bind(this), 1000);
      },
      itemRemovedCallback: (item) => {setTimeout(this.checkLayout.bind(this), 1000); },
      minCols: 12,
      maxCols: 12,
      minRows: 31,
      maxRows: 31,
      maxItemCols: 12,
      minItemCols: 1,
      maxItemRows: 31,
      minItemRows: 1,
      maxItemArea: 300,
      minItemArea: 1,
      defaultItemCols: 3,
      defaultItemRows: 10
    };
    this.components = [
      {cols: 4, rows: 8, y: 0, x: 0, dragEnabled: true, minItemRows: 5, minItemCols: 4, label: 'Initial Rows = 8, Initial Columns = 4\nMinimum Rows = 5, Minimum Columns = 4', delete: true, edit: true},
      {cols: 8, rows: 8, y: 0, x: 0, dragEnabled: true, minItemRows: 5, minItemCols: 8, label: 'Initial Rows = 8, Initial Columns = 8\nMinimum Rows = 5, Minimum Columns = 8', delete: true, edit: true},
      {cols: 4, rows: 10, y: 0, x: 0, dragEnabled: true, maxItemRows: 10, maxItemCols: 6, label: 'Initial Rows = 10, Initial Columns = 4\nMaximum rows = 10, Maximum Columns = 6', delete: true, edit: true},
      {cols: 2, rows: 2, y: 0, x: 0, dragEnabled: true, resizeEnabled: true, label: 'Initial Rows = 2, Initial Columns = 2\nDrag&Resize Enabled', delete: true, edit: true},
      {cols: 2, rows: 2, y: 0, x: 0, dragEnabled: false, resizeEnabled: false, label: 'Initial Rows = 2, Initial Columns = 2\nDrag&Resize Disabled', delete: true, edit: true},
      {cols: 2, rows: 2, y: 0, x: 0, dragEnabled: false, resizeEnabled: false, label: 'Initial Rows = 2, Initial Columns = 2\nDrag&Resize Disabled', delete: true, edit: true},
      {cols: 8, rows: 11, y: 0, x: 0, hasContent: true,  dragEnabled: true, resizeEnabled: true, delete: true, label: 'Graph and Table Component', type: GraphTableComponent, edit: true},
      {cols: 12, rows: 10, y: 0, x: 0, hasContent: true,  dragEnabled: true, resizeEnabled: true, delete: true, label: 'Multi Page Component', type: AccountDetailComponent, edit: true},
      {cols: 12, rows: 10, y: 0, x: 0, hasContent: true,  dragEnabled: true, resizeEnabled: true, delete: true, label: 'Multi Page Holdings Component', type: HoldingsComponent, edit: true},
      {cols: 6, rows: 12, y: 0, x: 0, hasContent: true,  dragEnabled: true, resizeEnabled: true, delete: true, label: 'Graph Component', type: GraphComponent, edit: true},
    ];
    this.dashboard = [
      {cols: 12, rows: 4, y: 0, x: 0, hasContent: true, dragEnabled: false, resizeEnabled: false, label: 'Header', delete: false,  type: HeaderComponent, edit: true},
      {cols: 12, rows: 3, y: 28, x: 0, hasContent: true, dragEnabled: false, resizeEnabled: false, label: 'Footer', delete: false, type: FooterComponent, edit: false},
      {cols: 6, rows: 12, y:16, x: 6, hasContent: true,  dragEnabled: true, resizeEnabled: true, delete: true, label: 'Multi Page Holdings Component', type: HoldingsComponent, edit: true},
      {cols: 6, rows: 12, y: 3, x: 0, hasContent: true,  dragEnabled: true, resizeEnabled: true, delete: true, label: 'Graph Component', type: GraphComponent, edit: true},
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
    // console.log(this.gridWidth, this.gridHeight);
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
    // console.log(newItem);
    this.fixSettings(newItem)
    this.dashboard.push(newItem);
  }
}
