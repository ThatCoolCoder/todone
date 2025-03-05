import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("aaaaaaaaaaaa", "routes/tailwindender.tsx"),
    layout("routes/app/layout.tsx", prefix("app", [
        index("routes/app/index.tsx")
    ])),
] satisfies RouteConfig;
