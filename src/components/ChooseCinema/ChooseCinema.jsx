import { useEffect, useState, useRef } from "react";
import { getCinemaByProvince } from "@apis/provinceService";

function ChooseCinema() {
    const [provinces, setProvinces] = useState([]);
    const [open, setOpen] = useState(false);
    const [openProvinceIndex, setOpenProvinceIndex] = useState(null);
    const [selectedCinema, setSelectedCinema] = useState(() => {
        const saved = localStorage.getItem("cinema");
        return saved ? JSON.parse(saved) : null;
    });
    const [isMobile, setIsMobile] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [availableCinemas, setAvailableCinemas] = useState([]);

    const defaultCinema = { _id: "68035db82d21be7453864e99", name: "VieFilm Nam Từ Liêm" };
    const dropdownRef = useRef(null);

    useEffect(() => {
        getCinemaByProvince().then((res) => {
            setProvinces(res.data);
        });
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
                setOpenProvinceIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!selectedCinema) {
            setShowModal(true);
        }
    }, [selectedCinema]);

    const handleCinemaClick = (cinema) => {
        localStorage.setItem('cinema', JSON.stringify({ _id: cinema._id, name: cinema.name }));
        setSelectedCinema({ _id: cinema._id, name: cinema.name });
        setOpen(false);
        setOpenProvinceIndex(null);
    };

    const handleProvinceClickMobile = (index) => {
        if (openProvinceIndex === index) {
            setOpenProvinceIndex(null);
        } else {
            setOpenProvinceIndex(index);
        }
    };

    const handleProvinceChange = (provinceName) => {
        setSelectedProvince(provinceName);
        const province = provinces.find((p) => p.name === provinceName);
        setAvailableCinemas(province ? province.cinemas : []);
    };

    const handleCinemaSelect = (cinemaId) => {
        const cinema = availableCinemas.find((c) => c._id === cinemaId);
        if (cinema) {
            localStorage.setItem('cinema', JSON.stringify({ _id: cinema._id, name: cinema.name }));
            setSelectedCinema({ _id: cinema._id, name: cinema.name });
            setShowModal(false);
        }
    };

    const handleCloseModal = () => {
        localStorage.setItem('cinema', JSON.stringify(defaultCinema));
        setSelectedCinema(defaultCinema);
        setShowModal(false);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Dropdown Button */}
            <div
                className="border rounded-md px-4 py-2 cursor-pointer bg-white hover:bg-gray-100 flex items-center text-xs"
                onClick={() => setOpen(!open)}
            >
                {selectedCinema ? selectedCinema.name : "Chọn Rạp"}
                <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown Content */}
            {open && (
                <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white z-50">
                    {provinces.map((province, index) => (
                        <div
                            key={province.name}
                            className="group relative"
                            onMouseEnter={!isMobile ? () => setOpenProvinceIndex(index) : undefined}
                            onMouseLeave={!isMobile ? () => setOpenProvinceIndex(null) : undefined}
                        >
                            <div
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                onClick={isMobile ? () => handleProvinceClickMobile(index) : undefined}
                            >
                                {province.name}
                                {province.cinemas.length > 0 && (
                                    <span className="ml-2">{isMobile ? (openProvinceIndex === index ? '-' : '+') : '>'}</span>
                                )}
                            </div>

                            {openProvinceIndex === index && (
                                <div className={`${isMobile ? '' : 'absolute top-0 left-full'} w-56 rounded-md shadow-lg bg-white`}>
                                    {province.cinemas.map((cinema) => (
                                        <div
                                            key={cinema._id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                                            onClick={() => handleCinemaClick(cinema)}
                                        >
                                            {cinema.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleCloseModal}>
                    <div className="bg-white p-6 rounded shadow-md relative w-96" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
                            onClick={handleCloseModal}
                        >
                            ✖
                        </button>
                        <h2 className="text-lg font-semibold mb-4 text-center">Chọn Tỉnh/Thành phố và Rạp</h2>
                        <div className="mb-4">
                            <select
                                value={selectedProvince}
                                onChange={(e) => handleProvinceChange(e.target.value)}
                                className="border rounded w-full p-2 text-sm"
                            >
                                <option value="">Chọn Tỉnh/Thành phố</option>
                                {provinces.map((province) => (
                                    <option key={province.name} value={province.name}>{province.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <select
                                onChange={(e) => handleCinemaSelect(e.target.value)}
                                className="border rounded w-full p-2 text-sm"
                                disabled={!availableCinemas.length}
                            >
                                <option value="">Chọn Rạp</option>
                                {availableCinemas.map((cinema) => (
                                    <option key={cinema._id} value={cinema._id}>{cinema.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChooseCinema;
