import { axiosRequest } from "../config/axios.config";
import { getAccessToken } from "../utils/auth.util";

export default {
  getStatistic: async ({ during, number }: { during: "monthly" | "yearly"; number: number }) => {
    const url = `/datasvc/api/statisticsRoad`;
    const requestUrl = `${url}?during=${during}&number=${number}`;
    try {
      const statisticInfo = await axiosRequest.get(requestUrl);
      return statisticInfo;
    } catch (error) {
      console.error("Error fetching statistics road:", error);
      throw error;
    }
  },
  getTask: async ({user_id} : {user_id: any}) => {
    const token = getAccessToken();
    const url = `/user/api/getTask`;
    const requestUrl = `${url}?user_id=${user_id}&token=${token}`;
    try {
      const taskInfo = await axiosRequest.get(requestUrl);
      return taskInfo;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }
};
