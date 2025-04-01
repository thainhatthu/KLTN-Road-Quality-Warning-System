import HomeComponent from "../../../components/Home/HomeComponent";
import AboutUsComponent from "../../../components/Home/AboutUsComponent";
import AppLayout from "../../../components/Common/AppLayout";
import LearnMoreComponent from "../../../components/Home/LearnMoreComponent";
import { useState } from "react";

export default function Home() {
  const [currentComponent, setCurrentComponent] = useState("home");
  const handleAboutUs = () => {
    setCurrentComponent("aboutUs");
  };
  const handleLearnMore = () => {
    setCurrentComponent("learnMore");
  };
  return (
    <AppLayout>
      <div>
        {currentComponent === "home" && (
          <HomeComponent
            onAboutUsClick={handleAboutUs}
            onLearnMoreClick={handleLearnMore}
          />
        )}
        {currentComponent === "aboutUs" && <AboutUsComponent />}
        {currentComponent === "learnMore" && <LearnMoreComponent />}
      </div>
    </AppLayout>
  );
}
