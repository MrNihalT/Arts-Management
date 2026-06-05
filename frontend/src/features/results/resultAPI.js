import api from "../../api/axios";

export const programResultAPI = async (programId) => {
    const response = await api.get(`/results/results/${programId}`);
    return response.data;
};

export const scoreUploadAPI = async (scoreData) => {
    const response = await api.post("/scores/", scoreData);
    return response.data;
};

export const detailedScoreAPI = async (scoreID) => {
    const response = await api.get(`/scores/${scoreID}`);
    return response.data;
};

export const detailedScoreUpdateAPI = async (scoreData) => {
    const response = await api.put(`/scores/${scoreData.id}`, scoreData);
    return response.data;
};
