import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {GridsterModule} from 'angular-gridster2';
import {MatMenuModule} from "@angular/material/menu";

// import { DragDropModule } from '@angular/cdk/drag-drop';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridComponent } from './grid/grid.component';
import { DragGridComponent } from './drag-grid/drag-grid.component';
import { GraphTableComponent } from './graph-table/graph-table.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    DragGridComponent,
    GraphTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MDBBootstrapModule.forRoot(),
    GridsterModule,
    ColorPickerModule,
//    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
