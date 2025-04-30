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
    },
    {
        path: '/v1/auth/verify-email/:token',
        component: lazy(() => import("@pages/VerifyEmail/VerifyEmail"))
    },
    { path: '/dat-ve/chon-ghe', component: lazy(() => import("@pages/Booking/Booking")), isPrivate: true },
    { path: '/admin', component: lazy(() => import("@pages/Admin/Dashboard/Dashboard")), isAdmin: true },
    { path: '/admin/phim', component: lazy(() => import("@pages/Admin/Movies/Movies")), isAdmin: true },
]

export default routers;