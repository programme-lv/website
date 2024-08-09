export const getJwt = () => {
  if (typeof document === "undefined") {
    return null;
  }
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="));

  return cookie ? cookie.split("=")[1] : null;
};

const setCookie = (name: any, value: any, expires?: string) => {
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; path=/" +
    (expires ? "; expires=" + expires : "");
};

export const removeJwt = () => {
  if (typeof document !== "undefined") {
    setCookie("jwt", "", "Thu, 01 Jan 1970 00:00:00 GMT");
  }
};

export const setJwt = (jwt: any) => {
  if (typeof document !== "undefined") {
    setCookie("jwt", jwt);
  }
};

export function parseJwt(token: any) {
  if (!token) {
    return null;
  }
  var base64Url = token.split(".")[1];

  if (!base64Url) {
    return null;
  }
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

export function getJWTDecoded() {
  const jwt = getJwt();

  if (!jwt || jwt === undefined) {
    return null;
  }

  return parseJwt(jwt);
}

type JWTUserInfo = {
  uuid: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
};

export function getUserInfoFromJWT() {
  const jwt = getJWTDecoded();

  if (!jwt || jwt === undefined) {
    return null;
  }

  return {
    uuid: jwt.sub,
    username: jwt.username,
    email: jwt.email,
    firstname: jwt.firstname,
    lastname: jwt.lastname,
  } as JWTUserInfo;
}
