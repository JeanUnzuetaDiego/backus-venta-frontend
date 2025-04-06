import { Routes } from '@angular/router';
import { DailyFocusComponent } from './pages/daily-focus/daily-focus.component';
import { PortadaComponent } from './pages/portada/portada.component';
import { MapaDohNrbComponent } from './pages/mapa-doh-nrb/mapa-doh-nrb.component';
import { VentasComponent } from './pages/MT/ventas/ventas.component';
import { LoginComponent } from './pages/login/login.component';
import { AutogestionComponent } from './pages/MT/autogestion/autogestion.component';
import { AnalisisPreciosComponent } from './pages/MT/analisis-precios/analisis-precios.component';
import { SkusInformadosComponent } from './pages/equivalencias/skus-informados/skus-informados.component';
import { MainComponent } from './pages/main/main.component';
import { TiendasInformadasComponent } from './pages/equivalencias/tiendas-informadas/tiendas-informadas.component';
import { VentaDiarioComponent } from './pages/MT/venta-diario/venta-diario.component';
import { PortadaPernodComponent } from './pages/pos-pernod/portada-pernod/portada-pernod.component';
import { StockDohComponent } from './pages/MT/stock-doh/stock-doh.component';
import { SameStoreSalesComponent } from './pages/MT/same-store-sales/same-store-sales.component';
import { PortadaEquivalenciasComponent } from './pages/equivalencias/portada-equivalencias/portada-equivalencias.component';
import { PermisosComponent } from './pages/config/permisos/permisos.component';
import { DescargablesComponent } from './pages/descargables/descargables.component';
import { UserAdminComponent } from './pages/user-admin/user-admin.component';
import { authGuard } from './auth.guard';
import { TottusComponent } from './pages/carga/tottus/tottus.component';
import { ExcelUploadComponent } from './components/shared/excel-upload/excel-upload.component';
import { VegaComponent } from './pages/carga/vega/vega.component';
import { CencosudComponent } from './pages/carga/cencosud/cencosud.component';
import { SupesaComponent } from './pages/carga/supesa/supesa.component';
import { TamboComponent } from './pages/carga/tambo/tambo.component';
import { CoestiComponent } from './pages/carga/coesti/coesti.component';
import { OxxoComponent } from './pages/carga/oxxo/oxxo.component';
import { ShareComponent } from './pages/cencosud/share/share.component';
import { PortadaComponent as PortadaCencosudComponent } from './pages/cencosud/portada/portada.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Ruta para el componente de inicio de sesión
  {
    path: '', // Ruta raíz
    redirectTo: '/login', // Redirige a la página de inicio de sesión
    pathMatch: 'full', // Asegura que la coincidencia sea exacta
  },
  {
    path: 'mt',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      { path: 'portada', component: PortadaComponent },
      { path: 'daily-focus', component: DailyFocusComponent },
      { path: 'mapa-doh-nrb', component: MapaDohNrbComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'autogestion', component: AutogestionComponent },
      { path: 'analisis-precios', component: AnalisisPreciosComponent },
      { path: 'venta-diario', component: VentaDiarioComponent },
      { path: 'stock-doh', component: StockDohComponent },
      { path: 'same-store-sales', component: SameStoreSalesComponent },
    ]
  },
  {
    path: 'cencosud',
    component: MainComponent,
    children: [
      { path: 'portada', component: PortadaCencosudComponent },
      { path: 'share', component: ShareComponent },
    ]
  },
  {
    path: 'equivalencia',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      { path: 'portada-equivalencias', component: PortadaEquivalenciasComponent},
      { path: 'skus-informados', component: SkusInformadosComponent },
      { path: 'tiendas-informadas', component: TiendasInformadasComponent },
      { path: 'portada-pernod', component: PortadaPernodComponent },
    ]
  },
  {
    path: 'cargar',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      { path: 'supesa', component: SupesaComponent },
      { path: 'cencosud', component: CencosudComponent },
      { path: 'tottus', component: TottusComponent },
      { path: 'tambo', component: TamboComponent },
      { path: 'vega', component: VegaComponent },
      { path: 'coesti', component: CoestiComponent },
      { path: 'oxxo', component: OxxoComponent },
      { path: 'excel', component: ExcelUploadComponent },
    ]
  },
  {
    path: 'configuracion',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      { path: 'permisos', component: PermisosComponent },
      { path: 'users', component: UserAdminComponent },
      // Agrega aquí más rutas secundarias si es necesario
    ]
  },
  {
    path: 'descarga',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
      { path: 'principal', component: DescargablesComponent },
    ]
  },
  {
    path: '**',
    redirectTo: '/portada'
  }
];
