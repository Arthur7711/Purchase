import { ref } from 'vue'

const useSelectedLang = () => {
  const lang = ref<'ru' | 'en'>('ru')
  const setLang = (lng: 'ru' | 'en') => {
    lang.value = lng
  }
  return { lang, setLang }
}

export default useSelectedLang()
