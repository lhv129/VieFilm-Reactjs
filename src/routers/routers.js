import { lazy } from "react";

const routers = [
    {
        path: '/',
        component: lazy(() => import("@pages/Client/Home/Home")),
    },
    {
        path: '/chi-tiet-phim/:slug',
        component: lazy(() => import("@pages/Client/MovieDetail/MovieDetail")),
    },
    {
        path: '/tai-khoan',
        component: lazy(() => import("@pages/Client/Auth/Auth")),
    },
    {
        path: '/verify-email/:token',
        component: lazy(() => import("@pages/Client/VerifyEmail/VerifyEmail")),
    },
    {
        path: '/dat-ve/chon-ghe',
        component: lazy(() => import("@pages/Client/Booking/Booking")),
        isPrivate: true,
    },
    {
        path: '/admin',
        component: lazy(() => import("@pages/Admin/Dashboard/Dashboard")),
        isAdmin: true,
    },
    {
        path: '/admin/phim',
        component: lazy(() => import("@pages/Admin/Movies/Movies")),
        isAdmin: true,
    },
    {
        path: '*',
        component: lazy(() => import("@pages/404NotFound/NotFound")),
    },
];

export default routers;
