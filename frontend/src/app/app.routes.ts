import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { authGuard } from './guards/AuthGuard/auth.guard';
import { CartComponent } from './components/protected/cart/cart.component';
import { OrderComponent } from './components/protected/order/order.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'products', component: ProductComponent},
    {path: 'details/:id', component: ProductDetailComponent},
    {path: 'cart', canActivate: [authGuard], component: CartComponent},
    {path: 'order', canActivate: [authGuard], component: OrderComponent},
    {path: '**', redirectTo: ''}
];
