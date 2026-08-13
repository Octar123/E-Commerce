import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { authGuard } from './guards/AuthGuard/auth.guard';
import { adminGuard } from './guards/AdminGuard/admin.guard';
import { CartComponent } from './components/protected/cart/cart.component';
import { OrderComponent } from './components/protected/order/order.component';
import { ProfileComponent } from './components/protected/profile/profile.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { AdminProductsComponent } from './components/admin/products/admin-products.component';
import { AdminTaxonomyComponent } from './components/admin/taxonomy/admin-taxonomy.component';
import { AdminUsersComponent } from './components/admin/users/admin-users.component';
import { AdminOrdersComponent } from './components/admin/orders/admin-orders.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'products', component: ProductComponent },
  { path: 'details/:id', component: ProductDetailComponent },
  { path: 'cart', canActivate: [authGuard], component: CartComponent },
  { path: 'order', canActivate: [authGuard], component: OrderComponent },
  { path: 'profile', canActivate: [authGuard], component: ProfileComponent },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: AdminProductsComponent },
      { path: 'taxonomy', component: AdminTaxonomyComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'orders', component: AdminOrdersComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
