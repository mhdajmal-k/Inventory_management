import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: apiUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const requestedApi = error.config;

        if (
            error.response.status === 401 &&
            error.response.data?.message === "Authorization denied. Invalid token"
        ) {
            try {
                if (error.response.data) {
                    const response = await axiosInstance.post("/api/user/refreshToken");
                    console.log(response);
                    if (response.status == 201) {
                        return axiosInstance(requestedApi);
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
