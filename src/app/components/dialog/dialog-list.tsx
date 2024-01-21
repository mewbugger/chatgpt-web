import styles from "./dialog-list.module.scss";
import {DialogListItem} from "./dialog-list-item";
import {DialogResizeableSidebar} from "@/app/components/dialog/dialog-resizeable-sidebar";
import {useNavigate} from "react-router-dom";
import {userChatStore} from "@/app/store/chat-store";
import {DialogHead} from "@/app/components/dialog/dialog-head";

/**
 * 对话框列表
 */
// 定义 DialogList 组件
export function DialogList() {
    // 使用 useNavigate 钩子获取导航函数
    const navigate = useNavigate();
    // 从 userChatStore 中获取聊天相关的状态和方法
    const chatStore = userChatStore();
    const [sessions, currentSessionIndex, selectSession] = userChatStore(
        (state) => [
            // 当前的会话列表
            state.sessions,
            // 当前选中的会话索引
            state.currentSessionIndex,
            // 方法：用于选择当前会话
            state.selectSession]);

    return (
        // DialogResizeableSidebar 用于调整对话栏的大小
        <DialogResizeableSidebar>
            {/*头部操作*/}
            <DialogHead/>
            {/*对话列表*/}
            <div className={styles["dialog-list"]}>
                {/* 遍历会话列表，为每个会话渲染一个 DialogListItem 组件 */}
                {sessions.map((session, index) => (
                    <DialogListItem
                        // 唯一键
                        key={session.id}
                        // 会话对象
                        session={session}
                        // 判断当前会话是否被选中
                        selected={currentSessionIndex === index}
                        onClick={() => {
                            // 点击时跳转到对应的界面，并传递必要参数信息
                            selectSession(index);
                            navigate(`/chat/${session.id}`, {state: {title: session.dialog.title}})
                        }}
                        // 定义删除事件：删除当前会话
                        onClickDelete={() => {
                            chatStore.deleteSession(index);
                        }}
                    />
                ))}
            </div>
        </DialogResizeableSidebar>
    );

}
