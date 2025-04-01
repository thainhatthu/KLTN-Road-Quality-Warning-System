import { useState, useEffect } from "react";
import road1 from "../../assets/img/road1.png";
import road2 from "../../assets/img/road2.png";
import road3 from "../../assets/img/road3.png";
import road4 from "../../assets/img/road4.png";
import road5 from "../../assets/img/road5.png";

const SimpleSlider = () => {
  // Lưu chỉ số của ảnh hiện tại
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [road1, road2, road3, road4, road5];

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]); 

  return (
    <div className="relative">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="rounded-xl"
      />

      <div className="absolute mt-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-blue-500" : "bg-gray-300"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleSlider;
