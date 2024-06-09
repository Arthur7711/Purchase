import { removeCookieToken } from "./getCookies";

export const redirect = () => {
    removeCookieToken();
    window.location.replace(
      `${import.meta.env.VITE_VUE_LOGIN}/?redirect=${import.meta.env.VITE_VUE_REDIRECT}`
    );
  };
  