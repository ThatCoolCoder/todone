import { Badge } from "@mantine/core";

export default function TagBadge({tag}: {tag: {title: string, color: string, description?: string}}) {
    return <Badge color={tag.color} autoContrast size="lg" title={tag.description ?? ""} >{tag.title}</Badge>
}