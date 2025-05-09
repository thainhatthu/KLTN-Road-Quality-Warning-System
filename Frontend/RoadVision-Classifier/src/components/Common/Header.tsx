import React, { useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import { accountState } from "../../atoms/authState";
import { Link } from "react-router-dom";
import { PageEnum } from "../../defination/enums/page.enum";
import { handleLogOut } from "../../utils/auth.util";
import defaultAvatar from "../../assets/img/defaultAvatar.png";
const api_url = "https://b9a3-42-116-6-46.ngrok-free.app";

const Header: React.FC = () => {
  const userRecoilStateValue = useRecoilValue(accountState);
  const [userRecoilState, setUserRecoilState] = useRecoilState(accountState);
  const items: MenuProps["items"] = [
    {
      label: (
        <Link className="text-base p-1" to={PageEnum.PROFILE}>
          Profile
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <div className="text-base p-1" onClick={handleLogOut}>
          Log out
        </div>
      ),
      key: "1",
    },
  ];

  useEffect(() => {
    const fetchAndValidateAvatar = async () => {
      const avatarUrl = `${api_url}/user/api/getAvatar?username=${userRecoilStateValue.username}`;
      const img = new Image();
      img.src = avatarUrl;
  
      img.onload = () => {
        setUserRecoilState((prevState) => ({
          ...prevState,
          avatar: avatarUrl,
        }));
      };
  
      img.onerror = () => {
        setUserRecoilState((prevState) => ({
          ...prevState,
          avatar: defaultAvatar,
        }));
      };
    };
  
    if (userRecoilStateValue?.username) {
      fetchAndValidateAvatar();
    }
  }, [userRecoilStateValue.username, setUserRecoilState]);
 
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#F9F9F9]">
      <div className="flex items-center space-x-4 w-96 px-4 py-2"></div>

      <div className="flex items-center space-x-4">
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
                  src={userRecoilState.avatar}
                  alt="User"
                  className="w-9 h-9 mr-1 rounded-full"
                />
                <span className="flex font-medium text-center">
                  {userRecoilStateValue.username}
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
