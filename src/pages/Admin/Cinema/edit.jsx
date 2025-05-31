import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Button, Form, Input, message, Skeleton, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getOne, editCinema } from "@apis/cinemaService";
import { useParams, useNavigate } from "react-router-dom";

function edit() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(true);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        getOne(slug)
            .then((res) => {
                const { name, address, images } = res.data;
                form.setFieldsValue({ name, address });
                if (images) {
                    setFileList([
                        {
                            uid: '-1',
                            name: 'Ảnh hiện tại',
                            status: 'done',
                            url: images,
                        },
                    ]);
                }
            })
            .finally(() => setIsLoading(false));
    }, [slug]);

    const onFinish = async (values) => {
        const { name, address } = values;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);

        const newImage = fileList.find(file => !!file.originFileObj);
        if (newImage) {
            formData.append("images", newImage.originFileObj);
        }

        try {
            const res = await editCinema(slug, formData);
            message.success(res.data.message);
            navigate("/admin/rap");
        } catch (err) {
            messageApi.open({
                type: "error",
                content: err?.response?.data?.message || "Lỗi không xác định!",
            });
        }
    };

    const handleChange = ({ fileList: newFileList }) => {
        const filteredList = newFileList.filter(file => file.originFileObj || file.status === 'done');
        setFileList(filteredList);
    };

    return (
        <>
            {contextHolder}
            <Helmet><title>Chỉnh sửa</title></Helmet>
            <h3 className="mb-4">Chỉnh sửa</h3>

            <Form
                form={form}
                name="edit-province"
                wrapperCol={{ span: 8 }}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Skeleton loading={isLoading} active>
                    <Form.Item
                        label="Tỉnh thành"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tỉnh thành!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Ảnh">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleChange}
                            beforeUpload={() => false}
                        >
                            {fileList.length < 1 && <div><PlusOutlined /> Tải ảnh lên</div>}
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Skeleton>
            </Form>
        </>
    );
}

export default edit;
