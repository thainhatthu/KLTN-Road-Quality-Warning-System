import mask from "../../assets/img/mask.png";
import ntbn from "../../assets/img/ntbn.jpg";
import lhat from "../../assets/img/lhat.jpg";
import tnt from "../../assets/img/tnt.jpg";
import nct from "../../assets/img/nct.png";
import { Breadcrumb, Card, Button } from "antd";
import { GithubOutlined, LinkedinOutlined } from "@ant-design/icons";

const { Meta } = Card;

export default function AboutUsComponent() {
  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col gap-5 justify-start items-center overflow-x-auto">
      <Breadcrumb
        className="w-full justify-start px-10"
        separator=">"
        items={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "About Us",
            className: "text-blue-800",
          },
        ]}
      />
      {/* HEADER */}
      <div className="flex flex-row w-[95%] h-28 rounded-2xl bg-[#2D82C6] justify-between relative">
        <img
          src={mask}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
        />

        <div className="z-100 w-full flex xl:flex-row p-10 items-center justify-between">
          <div>
            <p className="text-4xl font-bold text-white">
              About our development team
            </p>
          </div>
          <button className="w-32 bg-white text-[#3749A6] font-bold p-3 rounded-full hover:ring-3 hover:ring-blue-950">
            Contact us
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex xl:flex-row flex-col p-5 gap-10 bg-white w-[95%] h-full rounded-2xl mb-5">
        <div className="flex md:flex-row flex-col gap-10 bg-white justify-center items-center xl:w-1/2 w-2/3 mx-auto">
          <Card
            hoverable
            cover={
              <img
                alt="nct"
                src={nct}
                style={{
                  height: "300px",
                  width: "500px",
                  objectFit: "cover",
                }}
              />
            }
          >
            <Meta
              title="Nguyen Cao Thi"
              description="Leader/Project Manager"
              style={{ textAlign: "center" }}
            />
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <Button
                icon={<GithubOutlined />}
                onClick={() =>
                  window.open("https://github.com/ncthi/ncthi", "_blank")
                }
                shape="circle"
                style={{ marginRight: "10px" }}
              />
              <Button
                icon={<LinkedinOutlined />}
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/thi-nguyen-cao-a41a81322/",
                    "_blank"
                  )
                }
                shape="circle"
              />
            </div>
          </Card>
          <Card
            hoverable
            cover={
              <img
                alt="ntbn"
                src={ntbn}
                style={{
                  height: "300px",
                  width: "500px",
                  objectFit: "cover",
                }}
              />
            }
          >
            <Meta
              title="Nguyen Tra Bao Ngan"
              description="Leader/Project Manager"
              style={{ textAlign: "center" }}
            />
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <Button
                icon={<GithubOutlined />}
                onClick={() =>
                  window.open("https://github.com/ntbngannn", "_blank")
                }
                shape="circle"
                style={{ marginRight: "10px" }}
              />
              <Button
                icon={<LinkedinOutlined />}
                onClick={() =>
                  window.open("https://www.linkedin.com/in/ntbngan/", "_blank")
                }
                shape="circle"
              />
            </div>
          </Card>
        </div>
        <div className="flex md:flex-row flex-col gap-10 bg-white justify-center items-center xl:w-1/2 w-2/3 mx-auto">
          <Card
            hoverable
            cover={
              <img
                alt="tnt"
                src={tnt}
                style={{
                  height: "300px",
                  width: "500px",
                  objectFit: "cover",
                }}
              />
            }
          >
            <Meta
              title="Thai Nhat Thu"
              description="Leader/Project Manager"
              style={{ textAlign: "center" }}
            />
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <Button
                icon={<GithubOutlined />}
                onClick={() =>
                  window.open("https://github.com/thainhatthu", "_blank")
                }
                shape="circle"
                style={{ marginRight: "10px" }}
              />
              <Button
                icon={<LinkedinOutlined />}
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/thai-nhat-thu-863179311/",
                    "_blank"
                  )
                }
                shape="circle"
              />
            </div>
          </Card>
          <Card
            hoverable
            cover={
              <img
                alt="lhat"
                src={lhat}
                style={{
                  height: "300px",
                  width: "500px",
                  objectFit: "cover",
                }}
              />
            }
          >
            <Meta
              title="Le Huynh Anh Thu"
              description="Leader/Project Manager"
              style={{ textAlign: "center" }}
            />
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <Button
                icon={<GithubOutlined />}
                onClick={() =>
                  window.open("https://github.com/lhathu", "_blank")
                }
                shape="circle"
                style={{ marginRight: "10px" }}
              />
              <Button
                icon={<LinkedinOutlined />}
                onClick={() =>
                  window.open("https://www.linkedin.com/in/lhathu/", "_blank")
                }
                shape="circle"
              />
            </div>
          </Card>
        </div>
      </div>
      <div className="px-10 py-10 border-t border-gray-300">
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">
          Contact Us
        </h2>
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <strong className=" text-gray-700">Email:</strong>
            <a
              href="mailto:cloudkeeper4@gmail.com"
              className="text-blue-600 hover:underline mt-1"
            >
              cloudkeeper4@gmail.com
            </a>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <strong className="text-gray-700">Phone:</strong>
            <a
              href="tel:+84123456789"
              className="text-blue-600 hover:underline mt-1"
            >
              +84 123456789
            </a>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <i className="fas fa-map-marker-alt text-xl text-blue-500"></i>
            <strong className="text-gray-700">Address:</strong>
            <p className="text-gray-600 mt-1">
              Quarter 6, Linh Trung Ward, Thu Duc City, Ho Chi Minh City
            </p>
          </div>
        </div>
        <div className="text-center mt-10">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} RoadVision. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
