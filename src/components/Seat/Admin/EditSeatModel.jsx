import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Select, message, Button } from 'antd';
import { updateSeat, deleteSeat } from '@apis/seatService';

const EditSeatModal = ({ open, onCancel, seat, onSuccess }) => {
    // Lấy ra cinemaId
    const storedCinema = localStorage.getItem("cinema");
    const parsedProvince = storedCinema ? JSON.parse(storedCinema) : null;
    const cinemaId = parsedProvince?._id;

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    // Cập nhật lại form mỗi khi seat thay đổi
    useEffect(() => {
        if (seat) {
            form.setFieldsValue({
                type: seat.type,
                row: seat.row,
                number: seat.number,
                status: seat.status,
                price: seat.price,
            });
        }
    }, [seat, form]);

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const data = {
                    ...values,
                    seatId: seat._id,
                    screenId: seat.screenId,
                    cinemaId: cinemaId,
                };

                updateSeat(data)
                    .then(() => {
                        message.success("Cập nhật ghế thành công");
                        onSuccess();
                        onCancel();
                    })
                    .catch((error) => {
                        messageApi.open({
                            type: "error",
                            content: error.response?.data?.message || "Có lỗi xảy ra",
                        });
                    });
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const handleDelete = () => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc muốn xóa ghế ${seat?.seatCode}?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => {
                const data = {
                    seatId: seat?._id,
                    cinemaId:cinemaId,
                    screenId: seat?.screenId
                };

                return deleteSeat(data)
                    .then(() => {
                        message.success('Xóa ghế thành công');
                        onSuccess(); // cập nhật danh sách ghế
                        onCancel();  // đóng modal
                    })
                    .catch((error) => {
                        messageApi.open({
                            type: "error",
                            content: error.response?.data?.message || "Xóa ghế thất bại",
                        });
                    });
            }
        });
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={`Chỉnh sửa ghế ${seat?.seatCode}`}
                open={open}
                onCancel={() => {
                    form.resetFields();
                    onCancel();
                }}
                footer={
                    <div className="flex justify-between">
                        {/* Nút bên trái */}
                        <Button danger onClick={handleDelete}>
                            Xóa
                        </Button>

                        {/* Nút bên phải */}
                        <div>
                            <Button onClick={onCancel} style={{ marginRight: 8 }}>
                                Hủy
                            </Button>
                            <Button type="primary" onClick={handleOk}>
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                }
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Loại ghế"
                        name="type"
                        rules={[{ required: true, message: 'Vui lòng chọn loại ghế' }]}
                    >
                        <Select>
                            <Select.Option value="Ghế thường">Ghế thường</Select.Option>
                            <Select.Option value="Ghế VIP">Ghế VIP</Select.Option>
                            <Select.Option value="Ghế đôi">Ghế đôi</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Hàng"
                        name="row"
                        rules={[{ required: true, message: 'Vui lòng nhập hàng' }]}
                    >
                        <Input maxLength={1} />
                    </Form.Item>

                    <Form.Item
                        label="Số ghế"
                        name="number"
                        rules={[{ required: true, message: 'Vui lòng nhập số ghế' }]}
                    >
                        <InputNumber min={1} max={20} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select>
                            <Select.Option value="available">Hoạt động</Select.Option>
                            <Select.Option value="broken">Hỏng</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[
                            { required: true, message: 'Vui lòng nhập giá ghế' },
                            { type: 'number', message: 'Giá ghế phải là số' }
                        ]}
                    >
                        <InputNumber min={0} step={1000} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditSeatModal;
