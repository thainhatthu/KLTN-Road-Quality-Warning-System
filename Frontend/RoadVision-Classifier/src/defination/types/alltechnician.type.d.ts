export type AllTechnicianType = Partial<{
  user_id: number;
  username: string;
  fullname: string;
  joindate: string;
  role: string;
  tasks: string[];
}>;

export type TechiniciansTaskType = Partial<{
  username: string,
  province_name: string,
  district_name: string,
  ward_name: string,
  deadline: string,
}>
  