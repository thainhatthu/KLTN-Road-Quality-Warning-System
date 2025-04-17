import { axiosRequest } from "../config/axios.config";
import { getAccessToken } from "../utils/auth.util";

export default {
  getAllTask: async ({}) => {
    const url = `/datasvc/api/getTask`;
    const token = getAccessToken();
    const requestUrl = `${url}?token=${token}`;
    try {
      const response = await axiosRequest.get(requestUrl);
      return response;
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      throw error;
    }
  },

  getAllRoad: async (ward_id: number) => {
    const url = `/datasvc/api/getInfoRoads`;
    const requestUrl = `${url}?ward_id=${ward_id}&all=false&getDone=true`;
    try {
      const response = await axiosRequest.get(requestUrl);
      return response;
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      throw error;
    }
  },
  
};
