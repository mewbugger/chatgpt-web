import styles from './dialog-head.module.scss'
import {userChatStore} from "@/app/store/chat-store";
import {useNavigate} from "react-router-dom";
export function DialogHead(){
    // 使用 useNavigate 钩子获取导航函数
    const navigate = useNavigate();
    // 获取 chatStore 的状态和方法
    const chatStore = userChatStore();
    const [sessions, currentSessionIndex, selectSession] = userChatStore(
        (state) => [
            state.sessions,
            state.currentSessionIndex,
            state.selectSession]);
    return (
        <div className={styles["dialog-head"]}>
            {/* 搜索框 */}
            <div className={styles["dialog-search-box"]}><input type="text" placeholder="搜索"/></div>
            {/* 添加新会话的按钮 */}
            <div className={styles["dialog-search-add"]} onClick={() => {
                // 打开新的会话
                let session = chatStore.openSession();
                // 选择新会话，并导航到对应的聊天页面
                selectSession(0)
                navigate(`/chat/${session.id}`, {state: {title: session.dialog.title}})
            }}></div>
        </div>
    );

}
