import { Button, Group } from "@mantine/core";
import { modals } from "@mantine/modals";

export default function OkCancelButtons({okText, cancelText, okAction, cancelAction, closeModal}:
    {okText: string, cancelText?: string, okAction: () => void, cancelAction?: () => void, closeModal?: boolean}) {
    
    return <Group justify="flex-end">
        <Button variant="default" onClick={() => {
            if (closeModal ?? true) modals.closeAll();
            if (cancelAction) cancelAction();
        }}>{cancelText ?? "Cancel"}</Button>
        <Button onClick={() => {
            if (closeModal ?? true) modals.closeAll();
            okAction();
        }}>{okText}</Button>
    </Group>
}