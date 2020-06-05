import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridComponent } from './grid/grid.component';
import { DragGridComponent } from './drag-grid/drag-grid.component';
import { ColumnGridComponent } from './column-grid/column-grid.component';
import { RowGridComponent } from './row-grid/row-grid.component';

const routes: Routes = [
  { path: '', component: DragGridComponent },
  { path: 'grid', component: GridComponent },
  { path: 'dynamic-grid', component: DragGridComponent },
  { path: 'column-grid', component: ColumnGridComponent },
  { path: 'row-grid', component: RowGridComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
