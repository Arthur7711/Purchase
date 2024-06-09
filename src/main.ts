/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
import './assets/main.css';
import { createApp } from 'vue';
import '@mdi/font/css/materialdesignicons.css';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/browser';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Dropdown from 'primevue/dropdown';
import Menu from 'primevue/menu';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import ProgressBar from 'primevue/progressbar';
import App from './App.vue';
import router from './router';
import { Chart, registerables } from 'chart.js';
import Tree from 'primevue/tree';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';
import OverlayPanel from 'primevue/overlaypanel';
import AutoComplete from 'primevue/autocomplete';
import Checkbox from 'primevue/checkbox';
import Panel from 'primevue/panel';
import FileUpload from 'primevue/fileupload';
import Tooltip from 'primevue/tooltip';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Textarea from 'primevue/textarea';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import i18n from './locales/i18n_config';
import InlineMessage from 'primevue/inlinemessage';
import screenp from '@/store/plugin';
Chart.register(...registerables);

const app = createApp(App);
app.directive('tooltip', Tooltip);
app.use(PrimeVue);
app.use(ToastService).use(i18n);
app.use(screenp);
app.use(VueAxios, axios);
app.use(router);
app.component('Button', Button);
app.component('Avatar', Avatar);
app.component('Dropdown', Dropdown);
app.component('TabPanel', TabPanel);
app.component('TabView', TabView);
app.component('Calendar', Calendar);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('InlineMessage', InlineMessage);
app.component('ProgressBar', ProgressBar);
app.component('Tree', Tree);
app.component('Dialog', Dialog);
app.component('Message', Message);
app.component('OverlayPanel', OverlayPanel);
app.component('AutoComplete', AutoComplete);
app.component('Checkbox', Checkbox);
app.component('Panel', Panel);
app.component('Menu', Menu);
app.component('FileUpload', FileUpload);
app.component('Textarea', Textarea);
app.component('Toast', Toast);

// Sentry.init({
//   app,
//   dsn: import.meta.env.VITE_VUE_APP_SENTRY_DNS,
//   integrations: [
//     new BrowserTracing({
//       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
//       tracePropagationTargets: ['localhost']
//     })
//   ],
//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0
// });

app.mount('#app');
