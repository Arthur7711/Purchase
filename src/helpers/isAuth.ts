import { ref } from 'vue';

const getAuth = () => {
  const is_auth = ref<boolean>(false);
  const setAuth = (status: boolean) => {
    is_auth.value = status;
  };
  return { is_auth, setAuth };
};

export default getAuth();
