import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import Preloader from "@components/Preloader/Preloader";
import FormLogin from "@components/FormLogin/FormLogin";
import FormRegister from "@components/FormRegister/FormRegister";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

function Auth() {

    const [activeTab, setActiveTab] = useState('login');
    const { user } = useAuth();


    return (
        <>
            <Header></Header>
            {!user && (
                <div className="flex justify-center items-start mt-2">
                    <div className="w-[500px] bg-white rounded-lg shadow-md">
                        {/* Tabs */}
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`w-1/2 py-2 font-semibold rounded-tl-lg ${activeTab === 'login'
                                    ? 'text-white bg-sky-600'
                                    : 'text-black bg-white border-r border-gray-300'
                                    }`}
                            >
                                ĐĂNG NHẬP
                            </button>
                            <button
                                onClick={() => setActiveTab('register')}
                                className={`w-1/2 py-2 font-semibold rounded-tr-lg ${activeTab === 'register'
                                    ? 'text-white bg-sky-600'
                                    : 'text-black bg-white'
                                    }`}
                            >
                                ĐĂNG KÝ
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {activeTab === 'login' ? <FormLogin /> : <FormRegister />}
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    )
}


export default Auth;