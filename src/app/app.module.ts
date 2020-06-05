import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {GridsterModule} from 'angular-gridster2';
import {MatMenuModule} from "@angular/material/menu";

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NavbarModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md'
import { ColorPickerModule } from 'ngx-color-picker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridComponent } from './grid/grid.component';
import { DragGridComponent } from './drag-grid/drag-grid.component';
import { GraphTableComponent } from './graph-table/graph-table.component';
import { DynamicModule } from 'ng-dynamic-component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { HoldingsComponent } from './holdings/holdings.component';
import { HoldingsCustomizationComponent } from './holdings/holdings-customization.component';
import { GraphComponent } from './graph/graph.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ColumnGridComponent } from './column-grid/column-grid.component';
import { RowGridComponent } from './row-grid/row-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    DragGridComponent,
    GraphTableComponent,
    HeaderComponent,
    FooterComponent,
    AccountDetailComponent,
    HoldingsComponent,
    HoldingsCustomizationComponent,
    GraphComponent,
    ColumnGridComponent,
    RowGridComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MDBBootstrapModule.forRoot(),
    NavbarModule,
    WavesModule,
    ButtonsModule,
    GridsterModule,
    ColorPickerModule,
    DynamicModule.withComponents([GraphTableComponent, HeaderComponent, FooterComponent, AccountDetailComponent, HoldingsComponent, GraphComponent]),
    DragDropModule,
    HighchartsChartModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
