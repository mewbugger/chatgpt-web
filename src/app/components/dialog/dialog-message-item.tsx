import styles from './dialog-message-item.module.scss'
import {Avatar, Space} from "antd";
import {Message, MessageRole} from "@/types/chat";
import {RefObject} from 'react';
import {Markdown} from '@/app/components/markdown/markdown';
import {CopyOutlined, DeleteOutlined, SyncOutlined} from '@ant-design/icons'
import {ChatAction} from './dialog-message-actions'
import dayjs from 'dayjs'
import {userChatStore} from '@/app/store/chat-store';
import {copyToClipboard} from '@/utils'

/**
 * 用对象封装属性，方便扩展
 * 定义组件接收的props类型
 */
interface Props {
    // 消息对象
    message: Message;
    // 父组件的引用（可选）
    parentRef?: RefObject<HTMLDivElement>;
}

/**
 * 对话面板消息元素
 * 定义DialogMessageItem组件
 * @constructor
 */
export function DialogMessageItem(props: Props) {
    const {message, parentRef} = props;
    // 获取聊天存储的状态和方法
    const chatStore = userChatStore();
    // 判断消息是否由用户发送
    const isUser = message.role === MessageRole.user;
    // 格式化消息时间戳
    const date = message?.time ? dayjs(message.time).format('YYYY/MM/DD HH:mm:ss') : ''
    // 定义重试操作的处理函数
    const retryHandle = () => {
        chatStore.onRetry()
    }
    // 定义复制操作的处理函数
    const copyHandle = async () => {
        copyToClipboard(message.content)
    }
    // 定义删除操作的处理函数
    const deleteHandle = async () => {
        chatStore.deleteMessage(message)
    }
    // 渲染组件
    return <>
        <div
            className={
                isUser ? styles["chat-message-user"] : styles["chat-message"]
            }
        >
            {/* 消息容器 */}
            <div className={styles["chat-message-container"]}>
                {/* 消息头部 */}
                <div className={styles["chat-message-header"]}>
                    {/* 消息头像 */}
                    <div className={styles["chat-message-avatar"]}>
                        <Avatar shape="square" src={message.avatar} size={30} style={{
                            borderRadius: '4px',
                            backgroundColor: '#f6f6f6'
                        }}/>

                    </div>
                    {/* 消息操作按钮 */}
                    <div className={styles['chat-message-edit']}>
                        <Space>
                            {/* 重试按钮 */}
                            <ChatAction icon={<SyncOutlined/>} text="重试" onClick={retryHandle}/>
                            {/* 复制按钮 */}
                            <ChatAction icon={<CopyOutlined/>} text="复制" onClick={copyHandle}/>
                            {/* 删除按钮 */}
                            <ChatAction icon={<DeleteOutlined/>} text="删除" onClick={deleteHandle}/>
                        </Space>
                    </div>
                </div>
                {/* 消息内容 */}
                <div className={styles["chat-message-item"]}>
                    {/* Markdown 组件用于渲染消息内容 */}
                    <Markdown
                        content={message.content}
                        fontSize={14}
                        parentRef={parentRef}
                        defaultShow={false}
                        loading={
                            (message.content.length === 0) &&
                            !isUser
                        }
                    />
                </div>
                {/* 消息时间戳 */}
                <div className={styles['date']}>{date}</div>
            </div>
        </div>
    </>
}


