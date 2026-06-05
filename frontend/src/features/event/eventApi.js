import api from "../../api/axios";

export const eventAPI = async () => {
    const response = await api.get("/programs/");
    return response.data;
};

export const eventUploadAPI = async (credentials) => {
    const response = await api.post("/programs/", credentials);
    return response.data;
};

export const getActiveEventsAPI = async (query = "") => {
    const response = await api.get(`/programs/active/?${query}`);
    return response.data;
};

export const getFestsAPI = async () => {
    const response = await api.get("/programs/fests/");
    return response.data;
};

export const getEventsByYearAPI = async (year) => {
    const response = await api.get(`/programs/year/${year}/`);
    return response.data;
};

export const getEventDetailAPI = async (id) => {
    const response = await api.get(`/programs/${id}/`);
    return response.data;
};

export const searchStudentsAPI = async (query) => {
    const response = await api.get(`/auth/users/?role=student&search=${query}`);
    return response.data;
};

export const registerForEventAPI = async (id, registrationData) => {
    const response = await api.post(
        `/programs/${id}/register/`,
        registrationData,
    );
    return response.data;
};
