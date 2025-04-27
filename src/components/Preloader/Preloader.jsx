import React, { useEffect } from 'react';
import './preloader.css'

function Preloader() {
    useEffect(() => {
        // Tìm phần tử preloader và ẩn nó sau một khoảng thời gian hoặc khi một điều kiện nào đó xảy ra
        const preloader = document.getElementById('preloader');
        if (preloader) {
            // Ví dụ: Ẩn sau 2 giây
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000);
        }
        return () => {
        };
    }, []); // [] có nghĩa là useEffect chỉ chạy một lần sau lần render đầu tiên

    return (
        <div id="preloader">
            <div className="status">
                <img src="/images/header/horoscope.gif" alt="loader" />
            </div>
        </div>
    );
}

export default Preloader;
