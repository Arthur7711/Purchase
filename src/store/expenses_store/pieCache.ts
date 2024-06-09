// import { ref } from 'vue'

// const usePieCashe = () => {
//   const pieCashe = ref<string[]>(['все цели'])
//   const activePieType = ref('все цели')
//   const setPieCashe = (data: string) => {
//     if (pieCashe.value.length < 3) {
//       const length: number | string = data.split(' ').length
//       const res: string[] = []
//       data.split(' ').map((el, i: number) => {
//         if (i < length - 1) {
//           res.push(el)
//         }
//       })
//       pieCashe.value.push(res.join(' '))
//     }
//   }
//   const removePieCashe = (i: number) => {
//     if (i === 1) {
//       pieCashe.value = [pieCashe.value[0], pieCashe.value[1]]
//     } else if (i === 0) {
//       pieCashe.value = [pieCashe.value[0]]
//     }
//   }
//   return { pieCashe, activePieType, setPieCashe, removePieCashe }
// }

// export default usePieCashe()

import { ref } from 'vue';
import i18n_config from '@/locales/i18n_config';

const { messages, locale } = i18n_config.global;

const usePieCashe = () => {
  const pieCashe = ref<string[]>([messages[locale]['selected purposes']]);
  const activePieType = ref(messages[locale]['selected purposes']);
  const setPieCashe = (data: string) => {
    const length: number | string = data.split(' ').length;
    const res: string[] = [];
    switch (pieCashe.value.length) {
      case 1:
        data.split(' ').map((el, i) => {
          if (i < length - 1) {
            if (i === 0) {
              res.push(' ' + messages[locale]['purpose'] + ' - ' + el);
            } else {
              res.push(el);
            }
          }
        });
        pieCashe.value.push(res.join(' '));
        break;
      case 2:
        data.split(' ').map((el, i) => {
          if (i < length - 1) {
            if (i === 0) {
              res.push(' ' + messages[locale]['type'] + ' - ' + el);
            } else {
              res.push(el);
            }
          }
        });
        pieCashe.value.push(res.join(' '));
        break;
      case 3:
        break;
    }
  };
  const removePieCashe = (i: number) => {
    if (i === 1) {
      pieCashe.value = [pieCashe.value[0], pieCashe.value[1]];
    } else if (i === 0) {
      pieCashe.value = [pieCashe.value[0]];
    }
  };
  return { pieCashe, activePieType, setPieCashe, removePieCashe };
};

export default usePieCashe();
