import React, { useEffect, useState, useRef } from 'react';
import { getProvinces } from '@apis/provinceService';
import { getAllByProvince } from '@apis/cinemaService';
import Preloader from '@components/Preloader/Preloader';


const ModalSelect = () => {
    const [provinces, setProvinces] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedCinema, setSelectedCinema] = useState(null);
    const [loading, setLoading] = useState(true);
    const isRestored = useRef(true);

    // Gửi custom event để thông báo thay đổi cinema/province
    const notifyChange = () => {
        window.dispatchEvent(new Event('cinemaChanged'));
        window.dispatchEvent(new Event('provinceChanged'));
    };

    useEffect(() => {
        const storedProv = JSON.parse(localStorage.getItem('province') || 'null');
        const storedCin = JSON.parse(localStorage.getItem('cinema') || 'null');

        getProvinces().then((res) => {
            setProvinces(res.data);

            const restoreProvince = async (prov) => {
                setSelectedProvince(prov);
                localStorage.setItem('province', JSON.stringify(prov));
                const cinRes = await getAllByProvince(prov._id);
                setCinemas(cinRes.data);

                if (storedCin && cinRes.data.some(c => c._id === storedCin._id)) {
                    setSelectedCinema(storedCin);
                } else if (cinRes.data.length > 0) {
                    setSelectedCinema(cinRes.data[0]);
                    localStorage.setItem('cinema', JSON.stringify(cinRes.data[0]));
                }

                notifyChange(); // Gửi thông báo sau khi load xong
            };

            if (storedProv) {
                restoreProvince(storedProv).finally(() => {
                    isRestored.current = false;
                    setLoading(false);
                });
            } else {
                const defaultProv = res.data.find(p => p.name.toLowerCase() === 'hà nội');
                if (defaultProv) {
                    restoreProvince(defaultProv).finally(() => {
                        isRestored.current = false;
                        setLoading(false);
                    });
                } else {
                    isRestored.current = false;
                    setLoading(false);
                }
            }
        });
    }, []);

    useEffect(() => {
        if (!selectedProvince || isRestored.current) return;

        setLoading(true);
        getAllByProvince(selectedProvince._id).then((res) => {
            setCinemas(res.data);

            if (res.data.length > 0) {
                setSelectedCinema(res.data[0]);
                localStorage.setItem('cinema', JSON.stringify(res.data[0]));
            } else {
                setSelectedCinema(null);
                localStorage.removeItem('cinema');
            }

            notifyChange();
            setLoading(false);
        });
    }, [selectedProvince]);

    const handleProvinceChange = (e) => {
        const provId = e.target.value;
        const provObj = provinces.find(p => p._id === provId) || null;
        setSelectedProvince(provObj);

        if (provObj) {
            localStorage.setItem('province', JSON.stringify(provObj));
        } else {
            localStorage.removeItem('province');
        }

        setSelectedCinema(null);
        localStorage.removeItem('cinema');
        notifyChange();
    };

    const handleCinemaChange = (e) => {
        const cinId = e.target.value;
        const cinObj = cinemas.find(c => c._id === cinId) || null;
        setSelectedCinema(cinObj);

        if (cinObj) {
            localStorage.setItem('cinema', JSON.stringify(cinObj));
        } else {
            localStorage.removeItem('cinema');
        }

        notifyChange();
    };

    if (loading) return <Preloader />;

    return (
        <div className="flex flex-col sm:flex-row gap-2 flex-1 items-center">
            <select
                className="cursor-pointer border px-4 py-2 rounded-lg w-full sm:w-auto"
                value={selectedProvince?._id || ''}
                onChange={handleProvinceChange}
            >
                <option disabled value="">Chọn tỉnh thành</option>
                {provinces.map((province) => (
                    <option key={province._id} value={province._id}>
                        {province.name}
                    </option>
                ))}
            </select>

            {cinemas.length > 0 && (
                <select
                    className="cursor-pointer border px-4 py-2 rounded-lg w-full sm:w-auto"
                    value={selectedCinema?._id || ''}
                    onChange={handleCinemaChange}
                >
                    <option disabled value="">Chọn rạp phim</option>
                    {cinemas.map((cinema) => (
                        <option key={cinema._id} value={cinema._id}>
                            {cinema.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default ModalSelect;
