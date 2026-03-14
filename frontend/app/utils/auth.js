import Cookie from 'js-cookie';

export const setAuthToken = (token) => {
  Cookie.set('token', token, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const getAuthToken = () => {
  return Cookie.get('token');
};

export const removeAuthToken = () => {
  Cookie.remove('token');
};

export const isAuthenticated = () => {
  return !!Cookie.get('token');
};
