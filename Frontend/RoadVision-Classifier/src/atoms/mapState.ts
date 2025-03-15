//use to store Map data state, similar to redux  
import { atom } from "recoil";
import { GetInfoRoadsParams } from "../defination/types/data.type";

  export const mapState = atom({
    key: "mapState",
    default: {
       id_road: 0
    } as GetInfoRoadsParams, // default value
  });