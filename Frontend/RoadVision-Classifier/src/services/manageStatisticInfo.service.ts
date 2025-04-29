import { axiosRequest } from "../config/axios.config";
import { getAccessToken } from "../utils/auth.util";

export default {
  getStatistic: async ({
    during,
    number,
  }: {
    during: "monthly" | "yearly";
    number: number;
  }) => {
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

  getTask: async ({ user_id }: { user_id: any }) => {
    const token = getAccessToken();
    const url = `/datasvc/api/getTask`;
    const requestUrl = `${url}?user_id=${user_id}&token=${token}`;
    try {
      const taskInfo = await axiosRequest.get(requestUrl);
      return taskInfo;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  uploadReport: async (roadId: string, status: string, requestBody: object) => {
    const url = `/datasvc/api/updateStatus`;
    const token = getAccessToken();
    const requestUrl = `${url}?status=${status}&road_id=${roadId}&token=${token}`;
    try {
      const data = await axiosRequest.post(requestUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return data;
    } catch (error) {
      console.error("Error updating road status:", error);
      throw error;
    }
  },

  getReport: async ({ user_id }: { user_id: any }) => {
    const token = getAccessToken();
    const url = `/datasvc/api/getReportTask`;
    const requestUrl = `${url}?road_id=${user_id}&token=${token}`;
    try {
      const taskInfo = await axiosRequest.get(requestUrl);
      return taskInfo;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },
};
