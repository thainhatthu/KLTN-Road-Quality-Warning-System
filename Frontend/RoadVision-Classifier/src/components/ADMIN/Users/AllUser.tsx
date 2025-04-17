import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { Table, Modal, Button, Form, Input, message } from "antd";
import manageAlluserService from "../../../services/manageAlluser.service";
import { useRecoilState } from "recoil";
import { userState } from "../../../atoms/admin/accountState";
import { FaUser } from "react-icons/fa";
import homeheader from "../../../assets/img/USER-header.png";
import mask from "../../../assets/img/mask.png";

interface DataType {
  key: React.Key;
  avatar: string;
  username: string;
  fullname: string;
  joindate: string;
  contribution: number;
}
interface AllUserProps {
  onViewUserInfo: (user: DataType) => void;
}
const api_url = "https://exotic-strong-viper.ngrok-free.app";

export default function AllUser({ onViewUserInfo }: AllUserProps) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [, setRecoilProfile] = useRecoilState<any>(userState);
  const [form] = Form.useForm();

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await manageAlluserService.getAllUser({});
      const users = response.data?.map((user: any, index: number) => ({
        key: index,
        avatar: `${api_url}/${user.avatar}`,
        user_id: user.user_id,
        username: user.username,
        fullname: user.fullname,
        joindate: user.created,
        contribution: user.contribution,
      }));
      setDataSource(users);
      setRecoilProfile(users);
    } catch (error) {
      console.log("Không thể lấy danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleAddUser = async (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    const payload = { ...values, permission_id: "3" };
    try {
      await manageAlluserService.addNewUser(payload);
      message.success("Add user successfully!");
      fetchAllUsers();
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Fail to add new user!");
    }
  };

  const handleCancelModal = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleDeleteUser = async (username: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await manageAlluserService.deleteUser(username);
          message.success("Delete user successfully!");
          fetchAllUsers();
        } catch (error) {
          console.log("Xóa tài khoản thất bại!");
        }
      },
    });
  };

  const columns = [
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          USER ID
        </span>
      ),
      dataIndex: "user_id",
      key: "user_id",
      align: "center" as "center",
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          USER NAME
        </span>
      ),
      dataIndex: "username",
      key: "username",
      align: "center" as "center",
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          FULL NAME
        </span>
      ),
      dataIndex: "fullname",
      key: "fullname",
      align: "center" as "center",
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          JOIN DATE
        </span>
      ),
      dataIndex: "joindate",
      key: "joindate",
      align: "center" as "center",
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          CONTRIBUTION
        </span>
      ),
      dataIndex: "contribution",
      key: "contribution",
      align: "center" as "center",
      render: (contribution: number) => `${contribution} image(s)`,
    },
    {
      title: (
        <span
          style={{ color: "#23038C", fontWeight: "bold", fontSize: "16px" }}
        >
          ACTION
        </span>
      ),
      key: "action",
      align: "center" as "center",
      render: (_: any, record: DataType) => (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(record.username);
            }}
            className="text-red-500"
          >
            <AiOutlineDelete className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-screen flex flex-col gap-5 justify-start items-center overflow-y-auto">
      <div className="flex flex-row w-[100%] h-44 rounded-2xl bg-[#2D82C6] justify-between relative">
          <img
            src={mask}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
          />

          <div className="relative z-100 w-full flex xl:flex-row justify-between">
            {/* content */}
            <div className="flex flex-col p-10 justify-between">
              <div>
                <p className="text-4xl font-bold text-white">All Users management</p>
                <p className="text-white">
                  Thanks to the community of contributors!
                </p>
              </div>
              <div className="flex flex-row gap-4"></div>
            </div>
            {/* image */}
            <img
              src={homeheader}
              className="xl:h-full xl:block hidden mt-5 mr-10 "
            />
          </div>
        </div>
      <div className="w-full p-5 bg-white rounded-lg shadow-md">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="flex flex-row items-center gap-2">
            <FaUser color="#3B82F6" size={20} />
            <h1 className="text-2xl text-blue-500 font-bold">All Users</h1>
          </div>

          <button
            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg"
            onClick={() => setIsModalVisible(true)}
          >
            Add new user
          </button>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          onRow={(record) => ({
            onClick: () => onViewUserInfo(record),
          })}
          rowClassName="cursor-pointer"
        />
      </div>

      <Modal
        title="Add New User"
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancelModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
