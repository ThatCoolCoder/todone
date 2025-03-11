import { Card } from "@mantine/core";
import { Children, PropsWithChildren, ReactElement, ReactNode, useState } from "react";
import { OpenableCardContext } from "~/context/OpenableCardContext";

const bannedSelectors = ["input", "button", "a", "input *", "button *", "a *"];


export default function OpenableCard(props: PropsWithChildren) {
    const [open, setOpen] = useState(false);
    const [canChangeState, setCanChangeState] = useState(true);

    const contextValue = {
        open,
        setOpen,
        canChangeState,
        setCanChangeState,
    }

    let openContent: ReactNode | null = null;
    let closedContent: ReactNode | null = null;
    let otherContent: ReactNode[] = [];

    Children.forEach(props.children, child => {
        let type = (child as ReactElement).type;
        if (type === OpenableCard.Open) openContent = child;
        else if (type === OpenableCard.Closed) closedContent = child;
        else otherContent.push(child);
    })

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