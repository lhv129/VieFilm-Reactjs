// src/pages/Unauthorized.jsx
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white border border-red-200 shadow-md rounded-xl p-8 max-w-md text-center">
                <div className="flex justify-center mb-4 text-red-500">
                    <FaExclamationTriangle size={48} />
                </div>
                <h1 className="text-2xl font-bold text-red-600 mb-2">403 - Không được phép</h1>
                <p className="text-gray-600 mb-6">
                    Rất tiếc, bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là nhầm lẫn.
                </p>
                <button
                    onClick={() => navigate('/admin/thong-ke')}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
