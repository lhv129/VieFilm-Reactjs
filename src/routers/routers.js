import { lazy } from "react";


const routers = [
    {
        path: '/',
        component: lazy(() => import("@pages/Home/Home"))
    },
    {
        path: '/chi-tiet-phim/:slug',
        component: lazy(() => import("@pages/MovieDetail/MovieDetail"))
    },
    {
        path: '/dang-nhap',
        component: lazy(() => import("@pages/Auth/Auth"))
    }
]

export default routers;