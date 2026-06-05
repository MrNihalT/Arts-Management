import axios from "axios";

// In-memory access token store — never touches localStorage
let _accessToken = null;

export const setAccessToken = (token) => {
    _accessToken = token;
};
export const getAccessToken = () => _accessToken;
export const clearAccessToken = () => {
    _accessToken = null;
};

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const isAuthRequest =
        config.url.includes("/auth/login/") ||
        config.url.includes("/auth/token/refresh/") ||
        config.url.includes("/auth/register/");

    if (_accessToken && !isAuthRequest) {
        config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return config;
});

// Refresh lock — prevents multiple simultaneous refresh calls
let isRefreshing = false;
let pendingQueue = []; // requests waiting for the new access token

const processQueue = (error, token = null) => {
    pendingQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    pendingQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        const isAuthRequest =
            original.url.includes("/auth/login/") ||
            original.url.includes("/auth/token/refresh/");
        console.log(
            error.response?.status === 401 &&
                !original._retry &&
                !isAuthRequest,
        );
        if (
            error.response?.status === 401 &&
            !original._retry &&
            !isAuthRequest
        ) {
            if (isRefreshing) {
                // Queue this request until the ongoing refresh finishes
                return new Promise((resolve, reject) => {
                    pendingQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        original.headers.Authorization = `Bearer ${token}`;
                        return api(original);
                    })
                    .catch((err) => Promise.reject(err));
            }

            original._retry = true;
            isRefreshing = true;

            try {
                // Cookie is sent automatically by the browser (withCredentials)
                const res = await axios.post(
                    "http://localhost:8000/api/auth/token/refresh/",
                    {},
                    { withCredentials: true },
                );
                _accessToken = res.data.access;
                processQueue(null, _accessToken);
                original.headers.Authorization = `Bearer ${_accessToken}`;
                return api(original);
            } catch (refreshError) {
                // Refresh token expired — clear token and let Redux/PrivateRoute
                // redirect to /login naturally (NO window.location.href = no loop)
                _accessToken = null;
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default api;
