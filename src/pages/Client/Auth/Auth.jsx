import FormLogin from "@components/FormLogin/FormLogin";
import FormRegister from "@components/FormRegister/FormRegister";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";

function Auth() {

    const [activeTab, setActiveTab] = useState('login');
    const { user } = useAuth();


    return (
        <>
            <Helmet>
                <title>Tài khoản</title>
            </Helmet>
            {!user && (
                <div className="flex justify-center items-start mt-2">
                    <div className="w-[500px] bg-white rounded-lg shadow-md mx-4">
                        {/* Tabs */}
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`w-1/2 py-2 font-semibold cursor-pointer rounded-tl-lg ${activeTab === 'login'
                                    ? 'text-white bg-sky-600'
                                    : 'text-black bg-white border-r border-gray-300'
                                    }`}
                            >
                                ĐĂNG NHẬP
                            </button>
                            <button
                                onClick={() => setActiveTab('register')}
                                className={`w-1/2 py-2 font-semibold cursor-pointer rounded-tr-lg ${activeTab === 'register'
                                    ? 'text-white bg-sky-600'
                                    : 'text-black bg-white'
                                    }`}
                            >
                                ĐĂNG KÝ
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {activeTab === 'login' ? <FormLogin /> : <FormRegister />}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


export default Auth;