import { Ticket, MapPin, Clock, CalendarDays, CreditCard, CheckCircle, XCircle, Armchair } from "lucide-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

export default function TicketList({ tickets }) {
    if (!tickets || tickets.length === 0) {
        return <p className="text-center text-gray-500">Bạn chưa đặt vé nào.</p>;
    }

    return (
        <div className="space-y-6">
            {tickets.map((ticket) => {
                const seatCodes = ticket.seats.map((s) => s.seatCode).join(", ");
                const totalPrice = ticket.totalAmount.toLocaleString();
                const createdDate = dayjs(ticket.createdAt).format("DD/MM/YYYY");

                return (
                    <Link to={`/lich-su-mua-ve/${ticket._id}/chi-tiet`} key={ticket._id} className="mb-6 block">
                        <div
                            className="relative max-w-2xl mx-auto bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden border border-gray-200"
                        >
                            {/* Right side */}
                            <div className="w-full md:w-48 p-4 bg-gray-50 flex flex-col justify-between items-end order-first md:order-last md:mb-0">
                                <div className="flex flex-col items-end">
                                    <p className="text-xs text-gray-400">Mã vé</p>
                                    <p className="font-mono text-sm font-semibold text-gray-800 flex items-center gap-1">
                                        <Ticket className="w-4 h-4" />
                                        {ticket.code}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center gap-1">
                                    {ticket.status === "paid" ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <p className="text-sm font-semibold text-green-600">Đã thanh toán</p>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-5 h-5 text-blue-500" />
                                            <p className="text-sm font-semibold text-blue-500">Đã sử dụng</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Divider ngang (mobile only) */}
                            <div className="block md:hidden w-full border-t border-dashed border-gray-300" />


                            {/* Left side */}
                            <div className="flex-1 p-6 space-y-1">
                                <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                                    <Ticket className="w-5 h-5 text-indigo-500" />
                                    <div className="w-full">{ticket.movie.title}</div>
                                </h2>
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {ticket.cinema.name} - {ticket.screen.name}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {ticket.showtime.date} • {ticket.showtime.startTime}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <Armchair className="w-4 h-4" />
                                    Ghế: {seatCodes}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Tổng tiền: {totalPrice}₫
                                </p>
                                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4" />
                                    Ngày đặt: {createdDate}
                                </p>
                            </div>

                            {/* Punch-hole effect (desktop only) */}
                            <div className="absolute top-1/2 left-[calc(100%-12rem)] -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-gray-300 pointer-events-none hidden md:block" />
                            {/* Divider dọc (desktop only) */}
                            <div className="hidden md:block relative w-[1px] border-r border-dashed border-gray-300 self-stretch" />
                            <div className="absolute top-1/2 right-[12rem] -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-gray-300 pointer-events-none hidden md:block" />
                        </div>
                    </Link>

                );
            })}
        </div >
    );
}
