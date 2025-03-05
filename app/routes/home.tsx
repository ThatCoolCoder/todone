import { Link } from "react-router";
import type { Route } from "./+types/home";

import "./home.css";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Home() {
    // const a = ;

    return <div className="home-body flex flex-col justify-center h-screen">
        <div className="container max-w-screen-xl mx-auto my-auto">
            <div className="border rounded-2xl shadow-xl p-5">
                <p className="text-4xl mb-20">Todone</p>
                <p className="font-light text-xl mb-3">The best todo app ever created</p>
                <Link to="/app/">Get started</Link>
            </div>
        </div>
        <div className="bg-red-500"></div>
    </div>
}
