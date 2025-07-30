import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enviroment } from './src/environment';

axios.defaults.baseURL = enviroment?.API_URL; //add base url here
// axios.defaults.withCredentials = true
const apiInstance = axios.create();

apiInstance.interceptors.request.use(
  async request => {
    let token = await AsyncStorage.getItem('token');
    let deviceId = await AsyncStorage.getItem('deviceID');
    if (token != undefined) {
      request.headers = {
         Authorization: `Bearer ${token}`,
        'Content-Type': request.headers['Content-Type'],
        deviceuid: deviceId,
      };
    } else {
      if (request?.Authorization) {
        request.headers = {
          Authorization: request.Authorization,
        };
      } else {
        request.headers = {
          'Content-Type': request.headers['Content-Type'],
          deviceuid: deviceId,
        };
      }
    }
    return request;
  },
  error => {
    return Promise.reject(error);
  },
);

export default apiInstance;
