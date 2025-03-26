import { Badge } from "@mantine/core";

export default function TagBadge({color, text}: {color: string, text: string}) {
    return <Badge color={color} autoContrast size="lg" >{text}</Badge>
}