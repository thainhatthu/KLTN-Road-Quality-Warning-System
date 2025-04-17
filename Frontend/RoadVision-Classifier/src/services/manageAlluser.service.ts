import { axiosRequest } from "../config/axios.config";
import { AllUserType } from "../defination/types/alluser.type";
import { getAccessToken } from "../utils/auth.util";
export default {
    getAllUser: async ({}) =>
    {
        const url = `/user/api/getUserStatistics`;
        const token = getAccessToken();
        const requestUrl = `${url}?token=${token}`;
        try
        {
            const infoUser = await axiosRequest.get(requestUrl);
            return infoUser;
        }
        catch (error)
        {
            console.error("Error fetching all user:", error);
            throw error;
        }
    },
    addNewUser: async (formData: AllUserType) =>
    {
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
    deleteUser: async (username: string) =>
    {
        const url = `/auth/api/deleteUser?username=${username}`;
        
        try {
            const data = await axiosRequest.delete(url);
            console.log(data);
            return data;
        }
        catch (error)
        {
            console.error("Error deleting user:", error);
            throw error;
        }
    },
    getAllRoadInfo: async (user_id: number) => {
        const url = `/datasvc/api/getInfoRoads`;
        const requestUrl = `${url}?user_id=${user_id}&all=true&getDone=false`;
        try {
            const allRoadInfo = await axiosRequest.get(requestUrl);
            return allRoadInfo;
        }
        catch (error) {
            console.error("Error fetching all road info:", error);
            throw error;
        }
    }
}