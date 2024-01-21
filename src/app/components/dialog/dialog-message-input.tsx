import {useState} from "react";
import styles from './dialog-message-input.module.scss';
import {Button, Input} from "antd";
import {userChatStore} from "@/app/store/chat-store";
import DialogMessagesActions from "./dialog-message-actions";

// 定义组件接收的 props 类型
interface Props {
    // onEnter是一个函数，当用户输入并发送消息时调用
    onEnter: (value: any) => void;
}

/**
 * 对话消息输入
 * 定义DialogMessageInput组件
 * @constructor
 */
export function DialogMessageInput(props: Props) {
    // 从props中解构出onEnter函数
    const {onEnter} = props;
    // 获取聊天状态存储的状态和方法
    const chatStore = userChatStore();
    // 使用useState钩子管理输入框的值
    const [value, setValue] = useState<string>();
    // 获取当前聊天会话
    const currentSession = chatStore.currentSession();

    // 定义发送消息的处理函数
    const onSend = (value: any) => {
        // 调用 onEnter 函数发送消息
        onEnter(value);
        // 清空输入框
        setValue(undefined);
    }

    // 处理按键事件，实现Ctrl+Enter发送功能
    const handleKeyDown = (e: any) => {
        if (e.ctrlKey && e.key === "Enter") {
            onSend(value);
        }
    }

    // 渲染组件
    return (
        <div className={styles.wrapper}>
            {/* 显示消息操作按钮，如表情、附件等（具体实现取决于 DialogMessagesActions 组件） */}
            <DialogMessagesActions config={currentSession.config}/>
            <Input.TextArea
                // 绑定输入框的值
                value={value}
                // 处理值的变化
                onChange={(e) => setValue(e.target.value)}
                // 应用样式
                className={styles.textarea}
                // 占位符
                placeholder={"请输入"}
                // 自动聚焦
                autoFocus
                // 处理按键事件
                onKeyDown={handleKeyDown}/>
            <Button disabled={!value?.length} type="primary" className={styles.btn}
                    onClick={() => onSend(value)}>发送(Ctrl+Enter)</Button>
        </div>

    );

}
