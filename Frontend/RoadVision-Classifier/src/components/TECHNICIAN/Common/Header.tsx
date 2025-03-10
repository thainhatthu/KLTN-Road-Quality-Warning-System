import React from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import search from "../../../assets/img/search.png";
import notification from "../../../assets/img/notification.png";
import { Link } from "react-router-dom";
import { handleLogOut } from "../../../utils/auth.util";

const Header: React.FC = () => {
    const items: MenuProps["items"] = [
    {
      label: (
        <Link className="text-base p-1" to="/profile">
          Profile
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <div onClick={handleLogOut} className="text-base p-1">
          Log out
        </div>
      ),
      key: "1",
    },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#F9F9F9]">
      <div className="flex items-center space-x-4 w-96 px-4 py-2 bg-slate-100 border rounded-3xl focus-within:ring focus-within:ring-blue-300">
        <input
          type="text"
          placeholder="Search your..."
          className="flex-1 bg-slate-100 outline-none"
        />
        <img className="w-5 h-5" src={search} />
      </div>

      <div className="flex items-center space-x-4">
        {/* notification */}
        <button className="bg-white rounded-3xl w-10 h-10 p-2">
          <img src={notification} alt="" />
        </button>
        {/* account */}
        <button className="flex items-center justify-center bg-[#3749A6] rounded-full px-3 py-2">
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            overlayStyle={{ marginTop: "10px" }}
          >
            <a
              onClick={(e) => e.preventDefault()}
              className="flex items-center space-x-1 text-white"
            >
              <Space>
                <img
                  src="https://via.placeholder.com/40"
                  alt="User"
                  className="w-9 h-9 mr-1 rounded-full"
                />
                <span className="flex font-medium text-center">
                  TECHNICIAN
                </span>
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </button>
      </div>
    </header>
  );
};

export default Header;
