import { useParams } from "react-router-dom";
import { getAllByCinema } from "@apis/seatService";
import { useEffect, useState } from "react";
import Seat from "@components/Seat/Admin/Seat";
import { Helmet } from "react-helmet";
import { Button } from 'antd';
import AddSeatModal from "@components/Seat/Admin/AddSeatModal";

function List() {
    const { screenId } = useParams();
    const [seats, setSeats] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const fetchSeats = () => {
        getAllByCinema(screenId).then((res) => {
            setSeats(res.data);
        });
    };

    useEffect(() => {
        fetchSeats();
    }, [screenId]);

    return (
        <>
            <Helmet>
                <title>Sơ đồ ghế</title>
            </Helmet>
            <div className="flex justify-between mb-4">
                <h2>Sơ đồ ghế</h2>
                <Button type="primary" onClick={() => setOpenModal(true)}>
                    Thêm mới
                </Button>
            </div>
            <Seat seats={seats} fetchSeats={fetchSeats}/>
            <AddSeatModal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onSuccess={() => {
                    setOpenModal(false);
                    fetchSeats(); // fetch lại dữ liệu khi thêm thành công
                }}
                screenId={screenId}
            />
        </>
    );
}

export default List;
