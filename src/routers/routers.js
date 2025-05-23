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
        path: '/dat-ve',
        component: lazy(() => import("@pages/Client/Booking/Booking")),
        isPrivate: true,
    },
    {
        path: '/v1/tickets/vnpay-return',
        component: lazy(() => import("@pages/Client/Payment/ReturnVNPAY")),
        isPrivate: true,
    },
    {
        path: '/phim',
        component: lazy(() => import("@pages/Client/Movie/Movie")),
    },
    {
        path: '/lich-chieu-theo-rap',
        component: lazy(() => import("@pages/Client/Showtime/Showtime")),
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
        path: '/admin/rap',
        component: lazy(() => import("@pages/Admin/Cinema/list")),
        isAdmin: true,
        isOnlyAdmin: true,
    },
    {
        path: '/admin/rap/them-moi',
        component: lazy(() => import("@pages/Admin/Cinema/create")),
        isAdmin: true,
        isOnlyAdmin: true,
    },
    {
        path: '/admin/rap/:slug/chinh-sua',
        component: lazy(() => import("@pages/Admin/Cinema/edit")),
        isAdmin: true,
        isOnlyAdmin: true,
    },
    {
        path: '/admin/phong-chieu',
        component: lazy(() => import("@pages/Admin/Screen/list")),
        isAdmin: true,
    },
    {
        path: '/admin/phong-chieu/them-moi',
        component: lazy(() => import("@pages/Admin/Screen/create")),
        isAdmin: true,
    },
    {
        path: '/admin/phong-chieu/:id/chinh-sua',
        component: lazy(() => import("@pages/Admin/Screen/edit")),
        isAdmin: true,
    },
    {
        path: '/admin/phong-chieu/:screenId/so-do-ghe',
        component: lazy(() => import("@pages/Admin/Seat/list")),
        isAdmin: true,
    },
    {
        path: '/admin/suat-chieu',
        component: lazy(() => import("@pages/Admin/Showtime/list")),
        isAdmin: true,
    },
    {
        path: '/admin/suat-chieu/them-moi',
        component: lazy(() => import("@pages/Admin/Showtime/create")),
        isAdmin: true,
    },
    {
        path: '/admin/suat-chieu/:id/chinh-sua',
        component: lazy(() => import("@pages/Admin/Showtime/edit")),
        isAdmin: true,
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
