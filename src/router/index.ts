import { createRouter, createWebHashHistory } from 'vue-router';
import AnalisticLayout from '../layout/AnalisticLayout.vue';
import HomeView from '../views/HomeView.vue';
import NotFound from '../views/NotFound.vue';
import AccessDenied from '../views/AccessDenied.vue';
import Prices from '@/views/analistic/prices/Prices.vue';
import positionPage from '@/views/analistic/positionPage/positionPage.vue';
import Suppliers from '../views/analistic/suppliers/Suppliers.vue';
import Leaders from '@/views/analistic/leaders/Leaders.vue';
import ExpensesPage from '@/views/analistic/expenses/ExpensesPage.vue';
import Nomenclature from '../views/nomenclature/Nomenclature.vue';
import SuppliersPage from '../views/suppliers/SuppliersPage.vue';
import Supplier from '../views/suppliers/Supplier.vue';
import PurchasesPage from '../views/purchases/purchasesPage.vue';
import OfficesPage from '@/views/analistic/offices/OfficesPage.vue';
import PaymentsPage from '@/views/payments/PaymentsPage.vue';
import { getAuthUser } from '@/api/auth';
import isAuth from '@/helpers/isAuth';
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/access_denied',
      name: 'accessDenied',
      component: AccessDenied
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: AnalisticLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        { path: 'prices', component: Prices, name: 'prices' },
        { path: 'prices/:id', component: positionPage, name: 'position' },
        { path: 'suppliers', component: Suppliers, name: 'suppliers' },
        { path: 'leaders', component: Leaders, name: 'leaders' },
        { path: 'expenses', component: ExpensesPage, name: 'expenses' },
        { path: 'offices', component: OfficesPage, name: 'offices' },
        { path: '', redirect: '/analytics/expenses' }
      ]
    },
    {
      path: '/nomenclature',
      name: 'nomenclature',
      component: Nomenclature,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/suppliers',
      name: 'suppliers_page',
      component: SuppliersPage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/suppliers/:id',
      component: Supplier,
      name: 'Supplier',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFound
    },
    {
      path: '/purchases',
      name: 'purchases',
      component: PurchasesPage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/payments',
      name: 'payments',
      component: PaymentsPage,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

// router.beforeEach(async (to, from) => {
//   if (!isAuth.is_auth.value) {
//     await getAuthUser()
//       .then(() => isAuth.setAuth(true))
//       .catch(() => isAuth.setAuth(false));
//     if (to.meta.requiresAuth && !isAuth.is_auth.value) {
//       return '/access_denied';
//     }
//   }
// });

export default router;
