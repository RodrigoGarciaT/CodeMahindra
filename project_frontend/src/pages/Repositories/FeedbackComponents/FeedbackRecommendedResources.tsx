import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

type Resource = {
  title: string;
  image: string;
  link?: string;
};

type Props = {
  resources: Resource[];
};

export default function FeedbackRecommendedResources({ resources }: Props) {
  return (
    <div className="w-full px-2 py-4">
      <Swiper
        modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="w-full max-w-5xl mx-auto"
      >
        {resources.map((res, idx) => (
          <SwiperSlide
            key={idx}
            className="!w-64 bg-gradient-to-b from-[#20252b] to-[#15191e] rounded-xl border border-[#30363d] p-4 shadow-lg flex flex-col justify-between items-center"
          >
            <div className="w-full h-[150px] mb-3">
              <img
                src={res.image}
                alt={res.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <h3
              className="text-sm font-semibold text-white text-center truncate w-full"
              title={res.title}
            >
              {res.title}
            </h3>
            <a
              href={res.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full bg-[#c43b4e] hover:bg-[#a12d3c] transition text-white text-xs py-1.5 rounded text-center"
            >
              View
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
