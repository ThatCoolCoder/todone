import { Outlet } from "react-router"
import Navbar from "~/components/Navbar"
import "./layout.css"


export default function Layout() {
    return <div className="flex flex-col h-screen layout-body">
        <div className="border-b-1 border-white shadow-xl shadow-black w-full bg-neutral-900">
            <Navbar />
        </div>
        <div className="container mx-auto p-4 flex-1 bg-neutral-800 shadow-xl shadow-black border-x-1">
            <Outlet />
        </div>
    </div>
}