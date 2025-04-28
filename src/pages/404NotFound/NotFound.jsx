import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
                    Ôi không! Không tìm thấy trang 😢
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Có vẻ như bạn đã lạc vào một bộ phim chưa được chiếu. Hãy trở về rạp chiếu phim để tiếp tục khám phá những tuyệt phẩm nhé!
                </p>

                <Link
                    to="/"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition"
                >
                    Quay về Trang chủ
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
