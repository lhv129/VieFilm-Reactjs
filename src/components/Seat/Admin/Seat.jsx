import React, { useState } from "react";
import classNames from "classnames";
import EditSeatModal from "./EditSeatModel";

function Seat({ seats = [], selectedSeats = [], fetchSeats }) {

    
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSeatDetail, setSelectedSeatDetail] = useState(null);

    const openModal = (seat) => {
        setSelectedSeatDetail(seat);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSeatDetail(null);
        setIsModalOpen(false);
    };

    const seatRows = seats.reduce((acc, seat) => {
        const row = seat.seatCode.match(/^[A-Z]+/)[0];
        if (!acc[row]) acc[row] = [];
        acc[row].push(seat);
        return acc;
    }, {});

    const getSeatClass = (seat) => {
        if (seat.status === "broken") {
            if (seat.type === "Ghế thường") {
                return "bg-[url('/images/showtimes/seats/seat-error-normal.png')] bg-cover bg-center cursor-pointer w-8 h-8";
            }
            if (seat.type === "Ghế VIP") {
                return "bg-[url('/images/showtimes/seats/seat-error-vip.png')] bg-cover bg-center cursor-pointer w-8 h-8";
            }
            if (seat.type === "Ghế đôi") {
                return "bg-[url('/images/showtimes/seats/seat-error-double.png')] bg-cover bg-center cursor-pointer w-18 h-9";
            }
        }

        if (selectedSeats.includes(seat.seatCode)) {
            if (seat.type === "Ghế thường") {
                return "bg-[url('/images/showtimes/seats/seat-select-normal.png')] bg-cover bg-center cursor-pointer w-8 h-8";
            }
            if (seat.type === "Ghế VIP") {
                return "bg-[url('/images/showtimes/seats/seat-select-vip.png')] bg-cover bg-center cursor-pointer w-8 h-8";
            }
            if (seat.type === "Ghế đôi") {
                return "bg-[url('/images/showtimes/seats/seat-select-double.png')] bg-cover bg-center cursor-pointer w-18 h-9";
            }
        }

        if (seat.type === "Ghế thường") {
            return "bg-[url('/images/showtimes/seats/seatnormal.png')] bg-cover bg-center cursor-pointer w-8 h-8";
        }
        if (seat.type === "Ghế VIP") {
            return "bg-[url('/images/showtimes/seats/Seat.png')] bg-cover bg-center cursor-pointer w-8 h-8";
        }
        if (seat.type === "Ghế đôi") {
            return "bg-[url('/images/showtimes/seats/seatcouple.png')] bg-cover bg-center cursor-pointer w-18 h-9";
        }
    };

    return (
        <div className="w-full overflow-x-auto text-center">
            <div className="inline-block min-w-[800px]">
                <img src="/images/showtimes/ic-screen.png" alt="screen" className="w-200"/>
                <div className="w-full space-y-2 mb-8">
                    {Object.entries(seatRows)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([row, rowSeats]) => (
                            <div key={row} className="flex gap-2 justify-center">
                                {rowSeats
                                    .sort((a, b) => {
                                        const aNum = parseInt(a.seatCode.match(/\d+$/)[0]);
                                        const bNum = parseInt(b.seatCode.match(/\d+$/)[0]);
                                        return aNum - bNum;
                                    })
                                    .map((seat) => (
                                        <div
                                            key={seat.seatCode}
                                            className={classNames(
                                                "flex items-center justify-center text-[10px] rounded-md",
                                                getSeatClass(seat)
                                            )}
                                            onClick={() => openModal(seat)}
                                        >
                                            {seat.seatCode}
                                        </div>
                                    ))}
                            </div>
                        ))}
                </div>
            </div>

            {/* Modal */}
            <EditSeatModal
                open={isModalOpen}
                onCancel={closeModal}
                seat={selectedSeatDetail}
                onSuccess={() => {
                    fetchSeats();
                }}
            />
        </div>
    );
}

export default Seat;
