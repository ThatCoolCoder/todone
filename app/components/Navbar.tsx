import { Link } from "react-router";

export default function Navbar() {
    return <div className="container mx-auto flex flex-row items-end p-4 gap-4
        font-medium navbar ">
        <Link to="/" className="text-3xl mr-8">Todone</Link>
        <Link to="/sugma" className="mb-0.5 text-xl">link 1</Link>
        <Link to="/sugma" className="mb-0.5 text-xl">link 2</Link>
    </div>
}