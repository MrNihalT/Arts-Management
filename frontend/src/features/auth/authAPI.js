import api from "../../api/axios";

export const loginAPI = async (credentials) => {
    const response = await api.post("/auth/login/", credentials);
    return response.data;
};

export const registerAPI = async (userData) => {
    const response = await api.post("/auth/register/", userData);
    return response.data;
};

export const logoutAPI = async () => {
    const response = await api.post("/auth/logout/");
    return response.data;
};

export const getMeAPI = async () => {
    const response = await api.get("/auth/me/");
    return response.data;
};

export const getDepartmentsAPI = async () => {
    const response = await api.get("/auth/departments/");
    return response.data;
};

export const changePasswordAPI = async (passwords) => {
    const response = await api.post("/auth/change-password/", passwords);
    return response.data;
};

export const createUserAPI = async (userData) => {
    const response = await api.post("/auth/users/create/", userData);
    return response.data;
};

export const getUsersAPI = async () => {
    const response = await api.get("/auth/users/");
    return response.data;
};

export const getUserByIdAPI = async (id) => {
    const response = await api.get(`/auth/users/${id}/`);
    return response.data;
};

export const updateUserAPI = async (id, data) => {
    const response = await api.patch(`/auth/users/${id}/`, data);
    return response.data;
};

export const createDepartmentAPI = async (departmentData) => {
    const response = await api.post("/auth/departments/", departmentData);
    return response.data;
};

export const approveUserAPI = async (userId) => {
    const response = await api.patch(`/auth/users/${userId}/approve/`);
    return response.data;
};

export const rejectUserAPI = async (userId) => {
    const response = await api.delete(`/auth/users/${userId}/reject/`);
    return response.data;
};

export const assignRoleAPI = async (userId, role) => {
    const response = await api.patch(`/auth/users/${userId}/assign-role/`, {
        role,
    });
    return response.data;
};
export const getDepartmentByIdAPI = async (id) => {
    const response = await api.get(`/auth/departments/${id}/`);
    return response.data;
};

export const getAcademicYearsAPI = async () => {
    const response = await api.get("/auth/academic-years/");
    return response.data;
};

export const getAllAcademicYearsAPI = async () => {
    const response = await api.get("/auth/academic-years/?all=true");
    return response.data;
};

export const getProgramsAPI = async ({ year, active, all } = {}) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year);
    if (active !== undefined) params.append("active", active);
    if (all) params.append("all", "true");
    const response = await api.get(`/programs/?${params.toString()}`);
    return response.data;
};

export const getActiveProgramsAPI = async () => {
    const response = await api.get("/programs/active/");
    return response.data;
};

export const getProgramsByYearAPI = async (year) => {
    const response = await api.get(`/programs/year/${year}/`);
    return response.data;
};

export const getProgramByIdAPI = async (id) => {
    const response = await api.get(`/programs/${id}/`);
    return response.data;
};

export const createProgramAPI = async (data) => {
    const isFormData = data instanceof FormData;
    const response = await api.post("/programs/", data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
};

export const updateProgramAPI = async (id, data) => {
    const isFormData = data instanceof FormData;
    const response = await api.patch(`/programs/${id}/`, data, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
};

export const deleteProgramAPI = async (id) => {
    const response = await api.delete(`/programs/${id}/`);
    return response.data;
};

export const getArtsFestsAPI = async () => {
    const response = await api.get("/programs/fests/");
    return response.data;
};

export const registerForProgramAPI = async (programId, teamMemberIds = []) => {
    const response = await api.post(`/programs/${programId}/register/`, {
        team_member_ids: teamMemberIds,
    });
    return response.data;
};

export const assignDepartmentAPI = async (userId, departmentId) => {
    const response = await api.patch(
        `/auth/users/${userId}/assign-department/`,
        {
            department_id: departmentId,
        },
    );
    return response.data;
};
