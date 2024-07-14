export const getJwt = () => {
  if (typeof document === 'undefined') {
    return null;
  }
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="));
  return cookie ? cookie.split("=")[1] : null;
};

const setCookie = (name:any, value:any, expires?:string) => {
  document.cookie = name + '=' + encodeURIComponent(value) + '; path=/' + (expires ? '; expires=' + expires : '');
};


export const removeJwt = () => {
  if (typeof document !== 'undefined') {
    setCookie('jwt', '', 'Thu, 01 Jan 1970 00:00:00 GMT');
  }
};

export const setJwt = (jwt:any) => {
  if (typeof document !== 'undefined') {
    setCookie('jwt', jwt);
  }
};