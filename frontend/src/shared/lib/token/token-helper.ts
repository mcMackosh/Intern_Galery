import Cookies from "js-cookie";

export const getAccessToken = (): string | undefined => {
  return Cookies.get('access_token');
}

export const saveAccessToken = (accessToken: string) => {
  Cookies.set('access_token', accessToken, {
    sameSite: 'strict',
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
  });
}

export const removeAccessToken = () => {
  Cookies.remove('access_token');
}