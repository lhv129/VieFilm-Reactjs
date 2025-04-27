import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './movieslider.css'

const slides = [
    {
        image: '/images/banner/01.jpg',
    },
    {
        image: '/images/banner/02.jpg',
    },
    {
        image: '/images/banner/03.jpg',
    },
    {
        image: '/images/banner/04.jpg',
    },
    {
        image: '/images/banner/05.webp',
    },
    {
        image: '/images/banner/03.jpg',
    }
];

export default function Banner() {
    return (
        <div className="relative w-full h-[400px] md:h-screen overflow-hidden">
            {/* Background mờ */}
            <div className="absolute inset-0 z-0 opacity-100">
                <img
                    src="/images/banner/main_slider_bg_img.jpg"
                    className="w-full h-full object-cover brightness-[.4]"
                    alt="background"
                />
            </div>

            {/* Slider */}
            <div className="relative z-10 w-full h-full flex items-center">
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={30}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 1.2,
                            spaceBetween: 30,
                        },
                    }}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation
                    slidesPerView={1.4} // 👈 điều chỉnh số slide hiển thị
                    className="w-full px-[8vw]" // 👈 giúp tạo hiệu ứng mép hiển thị
                >
                    {slides.map((slide, i) => (
                        <SwiperSlide key={i}>
                            <div className="h-[30vh] relative rounded-xl overflow-visible shadow-2xl md:h-[80vh]  transition-all duration-500">
                                <img
                                    src={slide.image}
                                    alt={`slide-${i}`}
                                    className="object-cover w-full h-full rounded-xl"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}