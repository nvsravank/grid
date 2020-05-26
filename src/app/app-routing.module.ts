import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridComponent } from './grid/grid.component';
import { DragGridComponent } from './drag-grid/drag-grid.component';

const routes: Routes = [
  { path: '', component: DragGridComponent },
  { path: 'grid', component: GridComponent },
  { path: 'drag-grid', component: DragGridComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
