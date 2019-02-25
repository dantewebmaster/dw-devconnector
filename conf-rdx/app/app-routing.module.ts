import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DrugstoreComponent } from './pages/drugstore/drugstore.component';
import { ClientComponent } from './pages/client/client.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { AuthGuard } from './guard/auth.guard';
import { from } from 'rxjs';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'loja', component: DrugstoreComponent },
  { path: 'cadastro-cliente', component: ClientComponent },
  { path: '**'   , component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
