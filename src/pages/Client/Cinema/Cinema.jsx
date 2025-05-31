import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { getOneById } from "@apis/cinemaService";

function Cinema() {
    const [cinema, setCinema] = useState(null);

    useEffect(() => {
        const storedCinema = localStorage.getItem("cinema");
        if (storedCinema) {
            try {
                const parsedCinema = JSON.parse(storedCinema);
                const cinemaId = parsedCinema?._id;

                if (cinemaId) {
                    getOneById(cinemaId)
                        .then((res) => {
                            setCinema(res.data);
                        })
                        .catch((err) => {
                            console.error("Lỗi khi lấy thông tin rạp phim:", err);
                        });
                }
            } catch (e) {
                console.error("Lỗi khi parse localStorage:", e);
            }
        }
    }, []);

    return (
        <>
            <Helmet>
                <title>Thông tin rạp phim</title>
            </Helmet>

            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Thông tin rạp phim</h1>

                {cinema ? (
                    <div className="p-6 flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2">
                            <img
                                src={cinema.images || "https://via.placeholder.com/400x250?text=No+Image"}
                                alt={cinema.name}
                                className="w-full h-64 object-cover rounded-xl shadow"
                            />
                        </div>

                        <div className="w-full md:w-1/2 space-y-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">Tên rạp:</h2>
                                <p className="text-gray-900">{cinema.name}</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">Địa chỉ:</h2>
                                <p className="text-gray-900">{cinema.address}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">Đang tải thông tin rạp phim...</p>
                )}
            </div>
        </>
    );
}

export default Cinema;
