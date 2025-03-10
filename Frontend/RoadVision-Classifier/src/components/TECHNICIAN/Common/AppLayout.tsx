import { ReactNode } from "react";
import Sider from "./Sider";
import Header from "../Common/Header";

type LayoutPropsType = {
  children?: ReactNode;
};

export const AppLayout = ({ children }: LayoutPropsType) => {

  return (
    <div className="flex h-screen">
      <Sider />
      <div className="flex-1 flex flex-col">
        {/* header */}
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        {/* Passsing children */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
