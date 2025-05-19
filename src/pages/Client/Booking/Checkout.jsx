import { useEffect, useState, useRef } from "react";
import { getProducts } from "@apis/productService";
import { getOne } from "@apis/promoService";

function Checkout({ timeLeft, user, selectedSeats, seats, onProductsChange, onPromoChange }) {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [message, setMessage] = useState([]);
    const [discountPrice, setDiscountPrice] = useState(0);

    useEffect(() => {
        getProducts().then((res) => {
            setProducts(res.data);
        });
    }, []);

    const updateProductQuantity = (productId, delta) => {
        setSelectedProducts((prev) => {
            const existing = prev.find(p => String(p.productId) === String(productId));

            if (!existing && delta > 0) {
                const updated = [...prev, { productId, quantity: 1 }];
                onProductsChange(updated);
                return updated;
            }

            if (existing) {
                const newQuantity = existing.quantity + delta;
                if (newQuantity <= 0) {
                    const updated = prev.filter(p => String(p.productId) !== String(productId));
                    onProductsChange(updated);
                    return updated;
                }
                const updated = prev.map(p =>
                    String(p.productId) === String(productId)
                        ? { ...p, quantity: newQuantity }
                        : p
                );
                onProductsChange(updated);
                return updated;
            }

            return prev;
        });
    };

    const getQuantity = (productId) => {
        const item = selectedProducts.find(p => String(p.productId) === String(productId));
        return item?.quantity || 0;
    };

    const getComboTotal = () => {
        return selectedProducts.reduce((total, item) => {
            const product = products.find(p => String(p._id) === String(item.productId));
            if (!product) return total;
            return total + (product.price * item.quantity);
        }, 0);
    };

    const totalAmount = selectedSeats.reduce((total, code) => {
        const seat = seats.find(s => s.seatCode === code);
        return seat ? total + seat.price : total;
    }, 0);

    const getSeatSummary = () => {
        const summary = {};
        selectedSeats.forEach(code => {
            const seat = seats.find(s => s.seatCode === code);
            if (seat) {
                const type = seat.type;
                if (!summary[type]) {
                    summary[type] = { count: 0, total: 0, price: seat.price };
                }
                summary[type].count += 1;
                summary[type].total += seat.price;
            }
        });
        return summary;
    };

    const seatSummary = getSeatSummary();

    const discountRef = useRef();
    const handleApplyDiscount = () => {
        const name = discountRef.current.value;
        getOne(name).then((res) => {
            setMessage(res.message);
            setDiscountPrice(res.data.price || 0);
            onPromoChange && onPromoChange(res.data.name || "");
        }).catch(() => {
            setDiscountPrice(0);
            onPromoChange && onPromoChange("");
        });
    };

    const comboTotal = getComboTotal();
    const subTotal = totalAmount + comboTotal;
    const total = totalAmount + comboTotal - discountPrice;

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60).toString().padStart(2, "0");
        const sec = (seconds % 60).toString().padStart(2, "0");
        return `${min}:${sec}`;
    };

    return (
        <div className="md:w-2/3 flex flex-col items-center p-4 bg-white shadow">
            {/* THÔNG TIN THANH TOÁN */}
            <div className="mb-4 w-full">
                <div className="flex mb-2">
                    <img className="w-8 h-8 mr-2" src="/images/booking/ic-inforpayment.png" />
                    <h2 className="text-xl font-semibold text-gray-700">THÔNG TIN THANH TOÁN</h2>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                    <div>
                        <p className="text-gray-600">Họ Tên:</p>
                        <p className="font-medium">{user?.fullname || "Chưa có tên"}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Số điện thoại:</p>
                        <p className="font-medium">{user?.phone || "Chưa có SĐT"}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Email:</p>
                        <p className="font-medium">{user?.email || "Chưa có email"}</p>
                    </div>
                </div>
            </div>

            {/* GHẾ */}
            <div className="mb-4 w-full">
                <div className="flex items-center justify-center">
                    <div className="flex flex-wrap justify-center items-start gap-4 mt-4">
                        {[
                            { type: "Ghế thường", image: "/images/showtimes/seats/seatnormal.png" },
                            { type: "Ghế VIP", image: "/images/showtimes/seats/Seat.png" },
                            { type: "Ghế đôi", image: "/images/showtimes/seats/seatcouple.png" }
                        ].map(({ type, image }, index) => (
                            <div key={index} className="flex flex-col items-center text-center space-y-1 w-[100px]">
                                <img src={image} className="w-8 mx-auto" alt={type} />
                                <p className="text-sm">{type}</p>
                                {seatSummary[type] && (
                                    <p className="text-xs text-gray-600">
                                        {seatSummary[type].count} x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(seatSummary[type].price)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full">

                <div className="flex mb-3 mt-4">
                    <img className="w-8 h-8 mr-2" src="/images/booking/ic-combo.png" />
                    <h2 className="text-xl font-semibold text-gray-700">COMBO ƯU ĐÃI</h2>
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full bg-white rounded-md shadow">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4"></th>
                                <th className="py-2 px-4 text-left">Tên Combo</th>
                                <th className="py-2 px-4 text-left">Mô tả</th>
                                <th className="py-2 px-4 text-left">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="border-t">
                                    <td className="py-2 px-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden">
                                            <img
                                                src={product.images}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 font-medium">{product.name}</td>
                                    <td className="py-2 px-4 text-sm text-gray-600">
                                        <div className="max-h-[150px] overflow-y-auto break-words whitespace-pre-wrap">
                                            {product.description}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => updateProductQuantity(product._id, -1)}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-3 rounded-l"
                                            >
                                                -
                                            </button>
                                            <span className="mx-2">{getQuantity(product._id)}</span>
                                            <button
                                                onClick={() => updateProductQuantity(product._id, 1)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-r"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-4">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-md shadow p-4">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-16 h-16 rounded-full overflow-hidden">
                                    <img
                                        src={product.images}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="font-semibold">{product.name}</div>
                            </div>
                            <div className="text-sm text-gray-600 max-h-[150px] overflow-y-auto break-words whitespace-pre-wrap mb-2">
                                {product.description}
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => updateProductQuantity(product._id, -1)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-1 px-3 rounded-l"
                                >
                                    -
                                </button>
                                <span className="mx-2">{getQuantity(product._id)}</span>
                                <button
                                    onClick={() => updateProductQuantity(product._id, 1)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-r"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <div className="w-full mx-auto mt-4">
                {/* Mã giảm giá */}
                <div className="mb-4 mt-4">
                    <div className="flex mb-3">
                        <img className="w-10 h-8 mr-2" src="/images/booking/ic-payment.png" />
                        <h2 className="text-xl font-semibold text-gray-700">Mã giảm giá (nếu có)</h2>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Nhập mã giảm giá..."
                            ref={discountRef}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
                        />
                        <button
                            onClick={handleApplyDiscount}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                        >
                            Áp dụng
                        </button>
                    </div>
                    {message && (
                        <p className="mt-1 text-sm text-red-500">{message}</p>
                    )}
                </div>


                {/* Tổng tiền */}
                <div className="flex justify-end text-sm mb-4">
                    <div className="space-y-1 text-right">
                        <p>
                            <span className="font-semibold">Tổng tiền:</span>{" "}
                            <span className="text-red-600 font-medium">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subTotal)}
                            </span>
                        </p>
                        <p>
                            <span className="font-semibold">Số tiền được giảm:</span>{" "}
                            <span className="text-red-600 font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountPrice)}</span>
                        </p>
                        <p>
                            <span className="font-semibold">Số tiền cần thanh toán:</span>{" "}
                            <span className="text-red-600 font-medium">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                            </span>
                        </p>
                        <a href="#" className="text-blue-600 text-sm underline">
                            Hướng dẫn thanh toán
                        </a>
                    </div>
                </div>

                {/* Phương thức thanh toán */}
                <div>
                    <div className="flex mb-3">
                        <img className="w-10 h-8 mr-2" src="/images/booking/ic-payment.png" />
                        <h2 className="text-xl font-semibold text-gray-700">PHƯƠNG THỨC THANH TOÁN</h2>
                    </div>
                    <p className="text-xl mb-6 border-b pb-4">Chọn thẻ thanh toán</p>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {/* VN Pay */}
                        <label className="flex flex-col items-center gap-2 text-center cursor-pointer">
                            <input type="radio" name="payment" className="accent-blue-600" defaultChecked />
                            <img src="/images/booking/vnpay.png" alt="VN Pay" className="h-8" />
                            <span className="text-xs">VN Pay</span>
                        </label>

                        {/* ShopeePay */}
                        <label className="flex flex-col items-center gap-2 text-center cursor-pointer">
                            <input type="radio" name="payment" className="accent-blue-600" disabled />
                            <img src="/images/booking/shoppepay.png" alt="ShopeePay" className="h-8" />
                            <span className="text-xs">Ví ShopeePay</span>
                        </label>

                        {/* MoMo */}
                        <label className="flex flex-col items-center gap-2 text-center cursor-pointer">
                            <input type="radio" name="payment" className="accent-blue-600" disabled />
                            <img src="/images/booking/momo.png" alt="MoMo" className="h-8" />
                            <span className="text-xs">Ví MoMo</span>
                        </label>

                        {/* ZaloPay */}
                        <label className="flex flex-col items-center gap-2 text-center cursor-pointer">
                            <input type="radio" name="payment" className="accent-blue-600" disabled />
                            <img src="/images/booking/zalopay.png" alt="ZaloPay" className="h-8" />
                            <span className="text-xs">Ví ZaloPay</span>
                        </label>

                    </div>
                </div>

                {/* Ghi chú và đếm ngược */}
                <div className="flex justify-between items-center mt-6 border-t pt-4 text-sm">
                    <p>
                        Vui lòng kiểm tra thông tin đầy đủ trước khi qua bước tiếp theo. <br />
                        <span className="italic text-red-500">*Vé mua rồi không hoàn trả lại dưới mọi hình thức.</span>
                    </p>
                    <div className="text-center">
                        <p className="font-semibold">Thời gian còn lại</p>
                        <span className="text-2xl font-bold text-black">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
