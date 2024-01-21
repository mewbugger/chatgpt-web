import {useLocation, useParams} from 'react-router-dom';
import styles from "./dialog-message.module.scss";
import {DialogMessageItem} from "@/app/components/dialog/dialog-message-item";
import {MessageRole} from "@/types/chat";
import {DialogMessageInput} from "@/app/components/dialog/dialog-message-input";
import {createNewMessage, userChatStore} from "@/app/store/chat-store";
import userScrollToBottom from '@/app/hooks/useScrollToBottom';

interface Props {
    id: string,
    title: string
}

/**
 * 聊天面板
 * 定义DialogMessage组件
 * @constructor
 */
export function DialogMessage() {
    // 获取URL参数中的id
    const {id} = useParams();
    // 从聊天状态存储中获取状态和方法
    const chatStore = userChatStore();
    // 获取当前聊天会话
    const currentSession = chatStore.currentSession();
    // 获取当前页面的location对象
    const location = useLocation();
    // 使用自定义钩子来处理滚动到底部的逻辑
    const {scrollRef, setAutoScroll, scrollToBottom} = userScrollToBottom();
    // 获取会话标题，如果没有则默认为“新的对话”
    const title = location.state?.title || "新的对话";

    // 定义消息输入事件处理函数
    const onEnter = async (value: string) => {
        // 创建新消息并发送
        const newMessage = createNewMessage(value, MessageRole.user)
        await chatStore.onSendMessage(newMessage);
    }

    // 获取当前会话中清除上下文的索引
    const clearContextIndex =
        (currentSession.clearContextIndex ?? -1) >= 0
            ? currentSession.clearContextIndex!
            : -1;

    // 渲染对话面板
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>{title}</div>
            <div className={styles.scroll} ref={scrollRef}>
                {currentSession.messages?.map(
                    (message, index) => {
                        const shouldShowClearContextDivider = index === clearContextIndex - 1;
                        return <>
                            <DialogMessageItem message={message} key={index} parentRef={scrollRef}/>
                            {shouldShowClearContextDivider && <ClearContextDivider/>}
                        </>
                    })
                }
            </div>
            <DialogMessageInput onEnter={onEnter}/>
        </div>
    );

}

/**
 * 清除上下文对话信息
 * @constructor
 */
function ClearContextDivider() {
    const chatStore = userChatStore();

    return (
        <div
            className={styles["clear-context"]}
            onClick={() =>
                chatStore.updateCurrentSession(
                    (session) => (session.clearContextIndex = undefined),
                )
            }
        >
            <div className={styles["clear-context-tips"]}>上下文已清除</div>
        </div>
    );
}
