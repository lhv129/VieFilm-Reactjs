import { FaTags, FaClock } from "react-icons/fa";
import { RiMovie2AiFill } from "react-icons/ri";
import { MdDateRange, MdEventSeat } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { BiCameraMovie } from "react-icons/bi";
import Preloader from "@components/Preloader/Preloader";

function MovieInfo({ movie, parsedCinema, showtime, selectedSeats, handleContinue, goBackToSelectSeat }) {

    if (!movie) {
        return (
            <Preloader />
        );
    }

    return (
        <>
            <div className="flex">
                <div className="w-1/2">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full rounded shadow-lg"
                    />
                </div>
                <div className="w-1/2 px-4">
                    <h2 className="text-xl font-bold text-[#337ab7]">{movie.title}</h2>
                    <p className="text-sm">Ngôn ngữ {movie.language}</p>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="w-1/3 flex items-center">
                    <FaTags className="w-4 h-4 mr-2" />
                    <p>Thể loại</p>
                </div>
                <div className="w-2/3 text-right">
                    {movie.genres}
                </div>
            </div>
            <div className="flex justify-between">
                <div className="w-1/3 flex items-center">
                    <FaClock className="w-4 h-4 mr-2" />
                    <p>Thời lượng</p>
                </div>
                <div className="w-2/3 text-right">
                    {movie.duration} phút
                </div>
            </div>
            <div className="h-0.5 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,theme(colors.gray.500)_2px,theme(colors.gray.500)_6px)]">
            </div>
            <div className="flex justify-between">
                <div className="w-1/3 flex items-center">
                    <RiMovie2AiFill className="w-4 h-4 mr-2" />
                    <p>Rạp phim</p>
                </div>
                <div className="w-2/3 text-right">
                    {parsedCinema.name}
                </div>
            </div>
            <div className="flex justify-between">
                <div className="w-1/3 flex items-center">
                    <MdDateRange className="w-4 h-4 mr-2" />
                    <p>Ngày chiếu</p>
                </div>
                <div className="w-2/3 text-right">
                    {showtime.date}
                </div>
            </div>
            <div className="flex justify-between">
                <div className="w-1/3 flex items-center">
                    <BsClockHistory className="w-4 h-4 mr-2" />
                    <p>Giờ chiếu</p>
                </div>
                <div className="w-2/3 text-right">
                    {showtime.startTime}
                </div>
            </div>
            <div className="flex justify-between">
                <div className="w-1/3 flex items-center">
                    <BiCameraMovie className="w-4 h-4 mr-2" />
                    <p>Phòng chiếu</p>
                </div>
                <div className="w-2/3 text-right">
                    {showtime.screen.name}
                </div>
            </div>
            <div className="flex justify-between">
                <div className="w-1/3 flex items-center">
                    <MdEventSeat className="w-4 h-4 mr-2" />
                    <p>Chỗ ngồi</p>
                </div>
                <div className="w-2/3 text-right">
                    <span className="font-semibold">
                        {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn"}
                    </span>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                {/* Nút quay lại chọn ghế */}
                {goBackToSelectSeat && (
                    <button
                        onClick={goBackToSelectSeat}
                        className="w-full md:w-[45%] bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                    >
                        Quay lại
                    </button>
                )}

                {/* Button tiếp tục */}
                <button
                    onClick={handleContinue}
                    className="w-full md:w-[45%] bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                >
                    Tiếp tục
                </button>
            </div>
        </>
    )
}

export default MovieInfo;