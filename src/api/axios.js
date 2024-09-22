import axios from 'axios';
import handleTokenExpiry from '@/utils/handleTokenExpiry';
import handleAdminRole from '@/utils/handleAdminRole';

const {VITE_PROD_URL, VITE_DEV_URL} = import.meta.env;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_ENV === 'prod' ?  VITE_PROD_URL : VITE_DEV_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Add a request interceptor
axios.interceptors.response.use(
  (response) => response, // return response if it's not an error
  (error) => {
    if (error.response) {
      // Check if the error is due to an expired token
      if (error.response.status === 401) {
        handleTokenExpiry();
      }
      // Check if the user has admin permissions
      if (error.response.status === 403) {
        handleAdminRole(false);
      }
      // Use Promise.reject to propagate the error correctly in the promise chain.
      // This ensures that the error is handled by subsequent `catch` blocks in the chain,
      // maintaining the expected behavior of promise-based error handling.
      // If we don't use Promise.reject, the response will not be returned as a promise
      // and the error will not be handled properly.
      return Promise.reject(error.response);
    }
    return Promise.reject(new Error(`${error.message}`));
  },
);

axios.interceptors.request.use((config) => {
  const projectId = localStorage.getItem('projectId');
  if (projectId) {
    // if its a delete
    if (config.method === 'delete') {
      config.params = { ...config.params, project_id: projectId };
    }
  }
  return config;
});

export default axios;
