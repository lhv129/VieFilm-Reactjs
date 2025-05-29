import { useEffect, useState } from "react";
import { Modal, Select, message, Spin } from "antd";
import { updateRole } from "@apis/userService";
import { getAllRole } from "@apis/roleService";
import { getProvinces } from "@apis/provinceService";
import { getAllByProvince } from "@apis/cinemaService";

const { Option } = Select;

function GrantRoleModal({ visible, onClose, user, onSuccess }) {
    const userId = user?._id;

    const [loading, setLoading] = useState(false);

    const [roles, setRoles] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cinemas, setCinemas] = useState([]);

    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedCinema, setSelectedCinema] = useState(null);

    // Loading states cho từng Select
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingCinemas, setLoadingCinemas] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchRoles();

            fetchProvinces().then((provinceList) => {
                if (user?.cinemaId) {
                    findProvinceAndLoadCinemas(user.cinemaId, provinceList);
                } else {
                    setSelectedProvince(null);
                    setSelectedCinema(null);
                    setCinemas([]);
                }
            });

            setSelectedRole(user?.roleId || null);
        }
    }, [visible, user]);

    const fetchRoles = async () => {
        setLoadingRoles(true);
        try {
            const res = await getAllRole();
            setRoles(res.data);
        } catch (err) {
            message.error("Không thể tải danh sách quyền.");
        } finally {
            setLoadingRoles(false);
        }
    };

    const fetchProvinces = async () => {
        setLoadingProvinces(true);
        try {
            const res = await getProvinces();
            setProvinces(res.data);
            return res.data;
        } catch (err) {
            message.error("Không thể tải danh sách tỉnh thành.");
            return [];
        } finally {
            setLoadingProvinces(false);
        }
    };

    const fetchCinemas = async (provinceId) => {
        setLoadingCinemas(true);
        try {
            const res = await getAllByProvince(provinceId);
            setCinemas(res.data);
        } catch (err) {
            message.error("Không thể tải danh sách rạp.");
            setCinemas([]);
        } finally {
            setLoadingCinemas(false);
        }
    };

    const findProvinceAndLoadCinemas = async (cinemaId, provinceList) => {
        for (const province of provinceList) {
            try {
                const res = await getAllByProvince(province._id);
                const found = res.data.find((c) => c._id === cinemaId);
                if (found) {
                    setSelectedProvince(province._id);
                    setCinemas(res.data);
                    setSelectedCinema(cinemaId);
                    break;
                }
            } catch (err) {
                // ignore error per province
            }
        }
    };

    const handleProvinceChange = async (provinceId) => {
        setSelectedProvince(provinceId);
        setSelectedCinema(null);
        await fetchCinemas(provinceId);
    };

    const handleSubmit = async () => {
        if (!selectedRole || !selectedCinema) {
            message.warning("Vui lòng chọn đầy đủ quyền và rạp chiếu.");
            return;
        }

        setLoading(true);
        try {
            await updateRole({
                userId: userId,
                roleId: selectedRole,
                cinemaId: selectedCinema,
            });
            message.success("Cập nhật quyền thành công");
            onSuccess();
            onClose();
        } catch (err) {
            message.error("Cập nhật quyền thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Cấp quyền người dùng"
            open={visible}
            onOk={handleSubmit}
            onCancel={onClose}
            confirmLoading={loading}
            okText="Cập nhật"
            cancelText="Hủy"
        >
            <div className="space-y-4">
                {/* Select quyền */}
                <div>
                    <p className="mb-1">Chọn quyền:</p>
                    {loadingRoles ? (
                        <Spin />
                    ) : (
                        <Select
                            placeholder="Chọn quyền"
                            value={selectedRole}
                            onChange={setSelectedRole}
                            className="w-full"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {roles.map((role) => (
                                <Option key={role._id} value={role._id}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
                    )}
                </div>

                {/* Select tỉnh thành */}
                <div>
                    <p className="mb-1">Chọn tỉnh thành:</p>
                    {loadingProvinces ? (
                        <Spin />
                    ) : (
                        <Select
                            placeholder="Chọn tỉnh thành"
                            value={selectedProvince}
                            onChange={handleProvinceChange}
                            className="w-full"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {provinces.map((p) => (
                                <Option key={p._id} value={p._id}>
                                    {p.name}
                                </Option>
                            ))}
                        </Select>
                    )}
                </div>

                {/* Select rạp chiếu */}
                <div>
                    <p className="mb-1">Chọn rạp chiếu:</p>
                    {loadingCinemas ? (
                        <Spin />
                    ) : (
                        <Select
                            placeholder="Chọn rạp"
                            value={selectedCinema}
                            onChange={setSelectedCinema}
                            className="w-full"
                            disabled={!selectedProvince}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {cinemas.map((c) => (
                                <Option key={c._id} value={c._id}>
                                    {c.name}
                                </Option>
                            ))}
                        </Select>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default GrantRoleModal;
