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
        path: '/admin/thong-ke',
        component: lazy(() => import("@pages/Admin/Dashboardv2/Dashboard")),
        isAdmin: true,
    },
    {
        path: '/admin/phim',
        component: lazy(() => import("@pages/Admin/Movies/Movies")),
        isAdmin: true,
    },
    {
        path: '/admin/tinh-thanh',
        component: lazy(() => import("@pages/Admin/Province/list")),
        isAdmin: true,
        isOnlyAdmin: true,
    },
    {
        path: '/admin/tinh-thanh/them-moi',
        component: lazy(() => import("@pages/Admin/Province/create")),
        isAdmin: true,
        isOnlyAdmin: true,
    },
    {
        path: '/admin/tinh-thanh/:slug/chinh-sua',
        component: lazy(() => import("@pages/Admin/Province/edit")),
        isAdmin: true,
        isOnlyAdmin: true,
    },
    {
        path: '*',
        component: lazy(() => import("@pages/404NotFound/NotFound")),
    },
    {
        path: "/unauthorized",
        component: lazy(() => import("@pages/Unauthorized/Unauthorized")),
    }
];

export default routers;
