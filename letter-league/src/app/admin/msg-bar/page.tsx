"use client"

import { useMessageBar } from "@/components/layout/MessageBarContext";
import PageBase from "@/components/layout/PageBase";
import Button from "@/components/ui/Button";

interface Props {

}

export default function AdminMsgBarTest() {
    const { pushMessage, clearMessage } = useMessageBar();

    function onPushMsg() {
        pushMessage({
            msg: "Admin test msg",
            type: "information"
        });
    }
    
    function onClearBar() {
        clearMessage();
    }

    return (
        <PageBase>
            <Button onClick={onPushMsg}>
                Push Message
            </Button>

            <Button onClick={onClearBar}>
                Clear bar
            </Button>
        </PageBase>
    )
}