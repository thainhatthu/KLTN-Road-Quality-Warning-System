import { atom } from "recoil";
import { AllUserType } from "../../defination/types/alluser.type";
import { AllTechnicianType } from "../../defination/types/alltechnician.type";

export const userState = atom({
  key: "allUserState",
  default: {
      email: "",
      username: "",
      fullname: "",
      contribution: 0,
  } as AllUserType, 
});

export const technicianState = atom({
  key: "allTechnicianState",
  default: {
    user_id: 0,
    username: "",
    fullname: "",
    joindate: "",
    role: "",
    tasks: [],
  } as AllTechnicianType,
})