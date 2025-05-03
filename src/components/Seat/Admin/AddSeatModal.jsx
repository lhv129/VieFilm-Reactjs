import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { createSeat } from '@apis/seatService';


const AddSeatModal = ({ open, onCancel, screenId, onSuccess }) => {
    // Lấy ra cinemaId
    const storedCinema = localStorage.getItem("cinema");
    const parsedProvince = storedCinema ? JSON.parse(storedCinema) : null;
    const cinemaId = parsedProvince?._id;
    const [messageApi, contextHolder] = message.useMessage();
    if (!cinemaId) {
        console.error("Không tìm thấy cinema trong localStorage");
        return;
    }


    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const data = {
                    ...values,
                    screenId: screenId,
                    cinemaId: cinemaId,
                };

                createSeat(data)
                    .then(() => {
                        form.resetFields();
                        message.success("Thêm ghế thành công");
                        onSuccess();
                    })
                    .catch((error) => {
                        messageApi.open({
                            type: "error",
                            content: error.response.data.message,
                        });
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };



    return (
        <>
            {contextHolder}
            <Modal
                title="Thêm ghế mới"
                open={open}
                onOk={handleOk}
                onCancel={() => {
                    form.resetFields();
                    onCancel();
                }}
                okText="Thêm"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Hàng bắt đầu"
                        name="startRow"
                        rules={[{ required: true, message: 'Vui lòng nhập hàng bắt đầu' }]}
                    >
                        <Input maxLength={1} />
                    </Form.Item>

                    <Form.Item
                        label="Hàng kết thúc"
                        name="endRow"
                        rules={[{ required: true, message: 'Vui lòng nhập hàng kết thúc' }]}
                    >
                        <Input maxLength={1} />
                    </Form.Item>

                    <Form.Item
                        label="Số ghế"
                        name="number"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số ghế' },
                            { type: 'number', message: 'Số ghế phải là một số' },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            max={20}
                            placeholder="Nhập từ 1 đến 20"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Loại ghế"
                        name="type"
                        rules={[{ required: true, message: 'Vui lòng chọn loại ghế' }]}
                    >
                        <Select placeholder="Chọn loại ghế">
                            <Select.Option value="Ghế thường">Ghế thường</Select.Option>
                            <Select.Option value="Ghế VIP">Ghế VIP</Select.Option>
                            <Select.Option value="Ghế đôi">Ghế đôi</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Giá ghế"
                        name="price"
                        rules={[
                            { required: true, message: 'Vui lòng nhập giá ghế' },
                            { type: 'number', message: 'Giá ghế phải là một số' },
                        ]}
                    >
                        <InputNumber min={65000} max={200000} step={1000} style={{ width: '100%' }} />
                    </Form.Item>

                </Form>
            </Modal>
        </>
    );
};

export default AddSeatModal;
