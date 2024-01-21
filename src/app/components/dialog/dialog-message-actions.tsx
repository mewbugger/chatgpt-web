import {ClearOutlined} from '@ant-design/icons';
import styles from '@/app/components/dialog/dialog-message-action.module.scss';
import {Select} from 'antd'
import BreakIcon from "../../icons/break.svg";
import {userChatStore} from '@/app/store/chat-store';
import {GptVersion} from '../../constants'
import {SessionConfig} from "@/types/chat";
import { CSSProperties, useRef, useState } from 'react';

// 定义 Action 组件接收的 props
export function Action(props: {
    // 图标元素
    icon: JSX.Element;
    // 点击事件处理函数
    onClick?: () => void;
    // 自定义样式
    styles?: CSSProperties
}) {
    // 解构并重命名 props 中的 styles 为 sty
    const {styles: sty} = props
    // 渲染组件
    return <div className={styles['chat-input-action']}  onClick={props.onClick}>
        <div className={styles["icon"]}>
            {props.icon}
        </div>
    </div>
}
// 定义 ChatAction 组件接收的 props
export function ChatAction(props: {
    // 可选文本
    text?: string;
    // 图标元素
    icon: JSX.Element;
    // 点击事件处理函数
    onClick: () => void;
}) {
    // 创建一个ref用于图标元素
    const iconRef = useRef<HTMLDivElement>(null);
    // 创建一个ref用于文本元素
    const textRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState({
        // 完整宽度初始值
        full: 16,
        // 图标宽度初始值
        icon: 16,
    });

    // 更新宽度函数
    function updateWidth() {
        // 检查 ref 是否指向 DOM 元素
        if (!iconRef.current || !textRef.current) return;
        // 获取元素宽度的函数
        const getWidth = (dom: HTMLDivElement) => dom.getBoundingClientRect().width;
        // 获取文本宽度
        const textWidth = getWidth(textRef.current);
        // 获取图标宽度
        const iconWidth = getWidth(iconRef.current);
        // 更新宽度状态
        setWidth({
            // 完整宽度
            full: textWidth + iconWidth,
            // 图标宽度
            icon: iconWidth,
        });
    }

    // 渲染组件
    return (
        <div
            className={`${styles["chat-input-action"]} clickable`}
            onClick={() => {
                // 执行点击事件处理函数
                props.onClick();
                // 延迟更新宽度，以确保DOM元素已更新
                setTimeout(updateWidth, 1);
            }}
            // 鼠标悬浮时更新宽度
            onMouseEnter={updateWidth}
            // 触摸开始时更新宽度
            onTouchStart={updateWidth}
            style={
                {
                    "--icon-width": `${width.icon}px`,
                    "--full-width": `${width.full}px`,
                } as React.CSSProperties
            }
        >
            <div ref={iconRef} className={styles["icon"]}>
                {props.icon}{/* 显示传入的图标 */}
            </div>
            <div className={styles["text"]} ref={textRef}>
                {props.text}{/* 显示传入的文本 */}
            </div>
        </div>
    );
}
export default function DialogMessagesActions(props: {
    config: SessionConfig
}){
    const chatStore = userChatStore();
    const {config} = props
    return <div className={styles['chat-input-actions']}>
        <Select
            value={config?.gptVersion??GptVersion.GPT_3_5_TURBO}
            style={{ width: 160 }}
            options={[
                { value: GptVersion.GPT_3_5_TURBO, label: 'gpt-3.5-turbo' },
                { value: GptVersion.GPT_3_5_TURBO_16K, label: 'gpt-3.5-turbo-16k' },
                { value: GptVersion.TEXT_DAVINCI_002, label: 'text-davinci-002' },
                { value: GptVersion.TEXT_DAVINCI_003, label: 'text-davinci-003' },
                { value: GptVersion.GPT_4, label: 'gpt-4【暂无】' },
                { value: GptVersion.GPT_4_32K, label: 'gpt-4-32k【暂无】' },
            ]}
            onChange={(value) => {
                chatStore.updateCurrentSession((session) => {
                    session.config = {
                        ...session.config,
                        gptVersion: value
                    }
                });
            }}
        />
        <ChatAction text="清除聊天" icon={<ClearOutlined />} onClick={() => {
            chatStore.updateCurrentSession((session) => {
                if (session.clearContextIndex === session.messages.length) {
                    session.clearContextIndex = undefined;
                } else {
                    session.clearContextIndex = session.messages.length;
                }
            });
        }}/>
    </div>
}
