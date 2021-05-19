const ENDPOINT = 'https://nu.khataman.com/';
export const RECORD_URL = `${ENDPOINT}api/record/`;
export const DATA_URL = `${ENDPOINT}api/data/`;
export const API_HOST = `${ENDPOINT}api/admin/`;
export const ROUTE_URL = ENDPOINT;

const GLOBAL = {
    API_HOST: API_HOST,
    RECORD_URL: RECORD_URL,
    ROUTE_URL: ROUTE_URL,
    SECURE: false,
    COLORS: {
        GREEN_COLOR: '#41b6ac',
        BACKGROUND_COLOR: 'white',
        TEXT_COLOR: '#333',
        PRIMARY_COLOR: '#31b6e7'
    },
    ORGANIZATION: {
        name: 'Shopkhata',
        logo: '',
        headerLogo: '',
        secure: true
    },
    FIREBASE_CONFIG: {
        appId: "1:367357495613:web:e656dfc590c90903d69d54",
        apiKey: "AIzaSyCyFww-o7nepzeIGHpn4cKzUfBsIBqtP6s",
        projectId: 'shopkonnect-app',
        messagingSenderId: '367357495613',
        measurementId: "G-HFWE65YMGB"
    },
    SK_ANALYTIC_URL: '', // @todo to fill up
    DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm',
    API_DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    DISPLAY_DATE_TIME_FORMAT: 'DD MMM YYYY, HH:mm',
    DATE_FORMAT: 'YYYY-MM-DD',
    PLATFORM_ID: 3,
    APP_VERSION: '0.0.1'
}

export default GLOBAL;