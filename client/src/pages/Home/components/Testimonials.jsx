import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaQuoteLeft, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("reviews.json")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-[#FF4B2B] text-xl" />);
      } else if (i - 0.5 === rating) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-[#FF4B2B] text-xl" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-[#FF4B2B] text-xl" />);
      }
    }
    return stars;
  };

  return (
    <div className="py-16 bg-[#FFF6EE] text-[#2E2E2E] font-[inter]">
      <SectionTitle
        subHeading={"What Our Customers Say"}
        heading={"Testimonials"}
      />

      <div className="container mx-auto px-4">
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
          spaceBetween={30}
          slidesPerView={1}
          centeredSlides={true}
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-xl shadow-lg p-8 mx-auto max-w-2xl">
                <FaQuoteLeft className="text-5xl text-[#FF4B2B] mb-4" />
                <p className="text-lg font-normal italic text-[#2E2E2E]/90 leading-relaxed mb-4">
                  "{review.details}"
                </p>
                <div className="flex gap-1 mt-3">
                  {renderStars(review.rating)}
                </div>
                <h4 className="mt-4 text-xl font-semibold text-[#FF4B2B] tracking-wide">
                  {review.name}
                </h4>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonials;
