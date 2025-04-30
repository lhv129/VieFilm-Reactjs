import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyEmail } from "@apis/authService";
import { toast } from "react-toastify";
import Preloader from "@components/Preloader/Preloader";
import { Helmet } from "react-helmet";

function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        verifyEmail(token).then((res) => {
            if (res?.response) {
                // Lấy message từ API nếu có
                const msg = res.response.data?.message || "Xác thực thất bại";
                toast.error(msg, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored", // thêm dòng này để đổi màu nền theo kiểu cảnh báo
                });
                navigate("/");
            } else {
                toast.success(res.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate("/");
            }
        })
    })

    return (
        <>
            <Helmet>
                <title>Xác thực email</title>
            </Helmet>
            <Preloader />
        </>
    );

}

export default VerifyEmail;
