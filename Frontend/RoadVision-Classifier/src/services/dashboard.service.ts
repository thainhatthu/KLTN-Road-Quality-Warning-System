import { axiosRequest } from "../config/axios.config";

export default {
    getAllRoad: async ({}) => {
        const url = `/datasvc/api/getInfoRoads?all=true&getDone=false`;
        try {
            const response = await axiosRequest.get(url);
            return response;
        } catch (error) {
            console.error("Error fetching all roads:", error);
            throw error;
        }
    }
}