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
        const url = `/datasvc/api/assignTask`;
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
    },

    deleteTask: async (task_id: number) => {
        const url = `/datasvc/api/deleteTask`;
        const token = getAccessToken();
        const requestUrl = `${url}?task_id=${task_id}&token=${token}`;
        try
        {
            const response = await axiosRequest.delete(requestUrl);
            return response;
        }
        catch (error)
        {
            console.error("Error deleting task:", error);
            throw error;
        }
    },

    updateStatusRoad: async (roadId: string, status: string) => {
        const url = `/datasvc/api/updateStatus`;
        const token = getAccessToken();
        const requestUrl = `${url}?status=${status}&road_id=${roadId}&token=${token}`;
        try 
        {
            const data = await axiosRequest.post(requestUrl);
            return data;
        }
        catch (error)
        {
            console.error("Error updating road status:", error);
            throw error;
        }
    },

    updateStatusTask: async (ward_id: string, status: string) => {
        const url = `/datasvc/api/updateStatus`;
        const token = getAccessToken();
        const requestUrl = `${url}?status=${status}&ward_id=${ward_id}&token=${token}`;
        try 
        {
            const data = await axiosRequest.post(requestUrl);
            return data;
        }
        catch (error)
        {
            console.error("Error updating task status:", error);
            throw error;
        }
    }
}