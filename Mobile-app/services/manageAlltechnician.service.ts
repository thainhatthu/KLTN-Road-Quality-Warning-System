import { axiosRequest } from "../config/axios.config";
import { AllTechnicianType, TechiniciansTaskType } from "../defination/types/alltechnician.type";
import { getAccessToken } from "../utils/auth.util";

export default {
    getAllTechnician: async ({}) =>
    {
        const url = `/user/api/getTechnicalStatistics`;
        const token = getAccessToken();
        const requestUrl = `${url}?token=${token}`;
        try
        {
            const allTechnician = await axiosRequest.get(requestUrl);
            return allTechnician;
        }
        catch (error)
        {
            console.error("Error fetching all user:", error);
            throw error;
        }
    }, 

    addNewTechnician: async (formData: AllTechnicianType) => {
        const url = `/auth/api/addUser`;
        try
        {
            const data = await axiosRequest.post(url, formData);
            return data;
        }
        catch (error)
        {
            console.error("Error adding new user:", error);
            throw error;
        }
    },

    assignTask: async (formData: TechiniciansTaskType) => {
        const url = `/user/api/assignTask`;
        const token = getAccessToken();
        const requestUrl = `${url}?token=${token}`;
        try
        {
            const data = await axiosRequest.post(requestUrl, formData);
            return data;
        }
        catch (error)
        {
            console.error("Error assigning task:", error);
            throw error;
        }
    }
}