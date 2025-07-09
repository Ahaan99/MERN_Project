import publicApi from './publicApi';

export const handle401 = async (error, apiInstance) => {
  const originalRequest = error.config;

  if (
    (error.response?.status === 401 || error.response?.status === 403) &&
    !originalRequest._retry &&
    originalRequest.url !== '/refresh'
  ) {
    originalRequest._retry = true;
    try {
      await publicApi.post('/refresh');
      return apiInstance(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
};
