import { Helmet } from "react-helmet";
import { getProducts } from "@apis/productService";
import { useEffect, useState } from "react";
import ComboTable from "@components/ComboTable/ComboTable";
import { Button, message, Modal, Spin } from 'antd';
import { Link } from "react-router-dom";

function list() {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCombos = async () => {
        setLoading(true);
        try {
            const res = await getProducts();
            setCombos(res.data || []);
        } catch (error) {
            console.error('Lỗi lấy danh sách combo:', error);
            message.error('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCombos();
    }, []);

    return (
        <>
            <Helmet>
                <title>Danh sách sản phẩm</title>
            </Helmet>
            <div className="p-4">
                <div className="flex justify-end mb-4">
                    <Link to={`/admin/san-pham/them-moi`}>
                        <Button type="primary">Thêm mới</Button>
                    </Link>
                </div>

                <Spin spinning={loading}>
                    <ComboTable combos={combos} onReload={fetchCombos} />
                </Spin>
            </div>
        </>
    );
}

export default list;
