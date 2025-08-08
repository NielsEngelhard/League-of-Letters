"use client"

import { useMessageBar } from "@/components/layout/MessageBarContext";
import PageBase from "@/components/layout/PageBase";
import Button from "@/components/ui/Button";

interface Props {

}

export default function AdminMsgBarTest() {
    const { pushMessage, clearMessage } = useMessageBar();

    function onPushMsgInfinite() {
        pushMessage({
            msg: "on Push Msg Infinite",
            type: "information"
        }, null);
    }

    function onPushMsgTimed() {
        pushMessage({
            msg: "on Push Msg Timed",
            type: "warning"
        }, 2);
    }    
    
    function onClearBar() {
        clearMessage();
    }

    return (
        <PageBase>
            <Button onClick={onPushMsgInfinite}>
                Push Message infinite time
            </Button>

            <Button onClick={onPushMsgTimed}>
                Push Message 2 seconds
            </Button>            

            <Button onClick={onClearBar}>
                Clear bar
            </Button>
        </PageBase>
    )
}
