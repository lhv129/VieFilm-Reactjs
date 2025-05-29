import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { getAll } from "@apis/promoService";
import { Button, message, Spin } from "antd";
import { Link } from "react-router-dom";
import PromoTable from "@components/PromoTable/PromoTable";

function list() {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPromos = async () => {
        setLoading(true);
        try {
            const res = await getAll();
            setPromos(res.data || []);
        } catch {
            message.error("Không thể tải danh sách mã giảm giá");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    return (
        <>
            <Helmet>
                <title>Danh sách mã giảm giá</title>
            </Helmet>

            <div className="p-4">
                <div className="flex justify-end mb-4">
                    <Link to="/admin/ma-giam-gia/them-moi">
                        <Button type="primary">Thêm mới</Button>
                    </Link>
                </div>

                <Spin spinning={loading}>
                    <PromoTable promos={promos} onReload={fetchPromos} />
                </Spin>
            </div>
        </>
    );
}

export default list;
