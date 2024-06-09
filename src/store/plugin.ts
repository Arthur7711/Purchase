import App from '@/App.vue';
import ScreenParams from './screen';

export default {
  //@ts-ignore
  install: <T extends typeof App<any>>(app: T): any => {
    app.config.globalProperties.$screenp = {
      getters: {
        width: ScreenParams.screenParams.width,
        height: ScreenParams.screenParams.height
      },
      setters: {
        setWidth: (width: number) => (ScreenParams.setWidth = width),
        setHeight: (height: number) => (ScreenParams.setHeight = height)
      }
    };
  }
};

// plugins/i18n.js
// export default {
//     install: (app, options) => {
//       // inject a globally available $translate() method
//       app.config.globalProperties.$translate = (key) => {
//         // retrieve a nested property in `options`
//         // using `key` as the path
//         return key.split('.').reduce((o, i) => {
//           if (o) return o[i]
//         }, options)
//       }
//     }
//   }
