import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("aaaaaaaaaaaa", "routes/tailwindender.tsx"),
    layout("routes/app/layout.tsx", prefix("app", [
        index("routes/app/index.tsx"),
        route("tableview", "routes/app/tableview.tsx"),
        route("tags", "routes/app/tags.tsx"),
        ...prefix("todos", [
            ...prefix(":id", [
                route("history", "routes/app/todos/:id/history.tsx")
            ])
        ])
    ])),
] satisfies RouteConfig;
