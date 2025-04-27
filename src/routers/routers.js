import { lazy } from "react";


const routers = [
    {
        path: '/',
        component: lazy(() => import("@pages/Home/Home"))
    },
    {
        path: '/dang-nhap',
        component: lazy(() => import("@pages/Auth/Auth"))
    }
]

export default routers;