import { Breadcrumb } from "antd";
import step1 from "../../assets/img/step1.jpg";
import step2 from "../../assets/img/step2.png";
import step3 from "../../assets/img/step3.png";
import step4 from "../../assets/img/step4.png";
import mask from "../../assets/img/mask.png";
import useNavigateTo from "../../hooks/useNavigateTo";
interface Step {
  id: number;
  title: string;
  description: string;
  image: string;
  linkText?: string;
}
const steps: Step[] = [
  {
    id: 1,
    title: "Detect the damage road!",
    description:
      "Whenever you see road surface problems while driving, take a photo of it and upload it to our website using your user account.",
    image: step1,
  },
  {
    id: 2,
    title: "Received Result",
    description:
      "After uploading your road image, you will receive a result about the road's status. It will be shown in",
    image: step2,
    linkText: "here",
  },
  {
    id: 3,
    title: "Emergency fixing",
    description:
      "Our technicians team will be present at the location you provide to promptly repair the road. Our team will update about the status frequently for your convenience in",
    image: step3,
    linkText: "here",
  },
  {
    id: 4,
    title: "Q&A",
    description:
      "Whenever you have questions, do not hesitate to contact us through the message chatbox.",
    image: step4,
  },
];
export default function LearnMoreComponent() {
  const { navigateMap } = useNavigateTo();
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
            title: "Learn more",
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
            <p className="text-3xl font-bold text-white">
              How does this website work?
            </p>
          </div>
        </div>
      </div>
      <div className="flex p-5 gap-10 bg-white w-[95%] h-full rounded-2xl mb-5">
        <div className="flex flex-col gap-10 p-10">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col md:flex-row items-center gap-6 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Hình ảnh */}
              <img
                src={step.image}
                alt={step.title}
                className="w-full md:w-1/2 rounded-xl"
              />

              {/* Nội dung */}
              <div className="flex flex-col md:w-1/2 bg-blue-100 rounded-xl p-5 shadow-md relative">
                {/* Số thứ tự trong chấm tròn */}
                <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-20 h-20 bg-white border-8 border-blue-800 text-blue-800 font-bold text-3xl rounded-full shadow-md">
                  {step.id}
                </div>

                {/* Nội dung bước */}
                <h2 className="text-xl font-bold text-blue-800 mb-4 ml-10">
                  {step.title}
                </h2>
                <p className="text-gray-700 text-base ml-10">
                  {step.description}
                  {step.linkText && (
                    <a href="#" className="text-blue-600 underline ml-1">
                      {step.linkText}
                    </a>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="w-48 bg-[#3749A6] mb-5 text-white font-semibold p-3 rounded-full hover:ring-4 hover:ring-blue-300"
        onClick={navigateMap}
      >
        Get started
      </button>
    </div>
  );
}
