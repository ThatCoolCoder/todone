import { Link } from "react-router";

const links: {name: string, path: string}[] = [
    {name: "Table view", path: "/app/tableview"},
    {name: "Landing page", path: "/"},
    {name: "Manage tags", path: "/app/tags"},
]

export default function Navbar() {
    return <div className="container mx-auto flex flex-row items-end p-4 gap-8
        font-medium navbar ">
        <Link to="/app/" className="text-3xl mr-8">Todone</Link>
        {links.map(l => <Link key={l.name} to={l.path} className="mb-0.5 text-xl mr-8">{l.name}</Link>)}
    </div>
}