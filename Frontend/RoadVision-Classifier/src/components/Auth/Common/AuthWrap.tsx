import { ReactNode } from "react";
import road from "../../../assets/img/road.png";

interface Props {
  children: ReactNode;
}
const AuthWrap = ({ children }: Props) => {
  return (
    <div className="w-full h-screen bg-[#CFEEFF] flex justify-center items-center">
      <div className="flex flex-col md:flex-row w-[60%] lg:h-[80%] h-fit rounded-2xl bg-white shadow-2xl">
        {/* left container */}
        <div className="lg:w-1/2 p-5 w-full rounded-l-3xl overflow-auto flex justify-center items-center">
          {/* Auth Block Node */}
          {children}
        </div>
        {/* right container */}
        <div className="lg:w-1/2 hidden lg:block rounded-r-2xl bg-opacity-40 relative">
          <img
            src={road}
            className="w-full h-full object-cover rounded-r-2xl"
            alt="Road background"
          />
          <div className="absolute inset-0 bg-[#5277CD] bg-opacity-30 rounded-r-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthWrap;
