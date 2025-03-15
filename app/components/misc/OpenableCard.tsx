import { Card } from "@mantine/core";
import { Children, PropsWithChildren, ReactElement, ReactNode, useState } from "react";
import { OpenableCardContext } from "~/context/OpenableCardContext";

const bannedSelectors = ["input", "button", "a", "input *", "button *", "a *"];


export default function OpenableCard({children, canChangeState}: {children?: ReactNode, canChangeState: boolean}) {
    const [open, setOpen] = useState(false);

    const contextValue = {
        open,
        setOpen,
    }

    let openContent: ReactNode | null = null;
    let closedContent: ReactNode | null = null;
    let otherContent: ReactNode[] = [];

    if (children != undefined) {
        Children.forEach(children, child => {
            let type = (child as ReactElement).type;
            if (type === OpenableCard.Open) openContent = child;
            else if (type === OpenableCard.Closed) closedContent = child;
            else otherContent.push(child);
        })
    }

    return <Card onClick={e => {
            // prevent clicking on internal controls from doing stuff
            if (bannedSelectors.some(s => (e.target as HTMLElement).matches(s))) return;
            if (! canChangeState) return;
            e.preventDefault();
            setOpen(!open);
        }}>
        <OpenableCardContext.Provider value={contextValue}>
            {otherContent}
            {open && openContent != null && openContent}
            {! open && closedContent != null && closedContent}
        </OpenableCardContext.Provider>
    </Card>
}

OpenableCard.Open = function(props: PropsWithChildren) {
    return props.children;
}

OpenableCard.Closed = function(props: PropsWithChildren) {
    return props.children;
}