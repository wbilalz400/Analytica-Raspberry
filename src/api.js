import axios from 'axios';

const BASE_URL = "http://localhost:3001";
const LOGIN = "/login";
const DEVICE = '/device';
const ADD_DEVICE = '/device/initialize';
const GET_SENSORS = '/device/id/';
const ADD_SENSOR = '/device/sensor/create'

const API = axios.create({
    baseURL: BASE_URL,
});

API.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
}, error => {
    return Promise.reject(error)
})

export const login = (payload) => {
    return API.post(LOGIN, payload);
}

export const getDevices = () => API.get(DEVICE);

export const addDevice = (payload) => API.post(ADD_DEVICE,payload);

export const getSensors = id => API.get(GET_SENSORS + id);

export const addSensor = payload => API.post(ADD_SENSOR,payload);