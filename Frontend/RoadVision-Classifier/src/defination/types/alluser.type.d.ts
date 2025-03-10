export type AllUserType = Partial<{
    email: string;
    username: string;
    fullname: string;
    joindate: string;
    contribution: number;
    role: string;
    permission_id: string;
  }>;
  
export interface RoadDataType {
  key: React.Key;
  road_id: number;
  road_image: string;
  road_type: string;
  road_time: string;
  road_location: string;
}
