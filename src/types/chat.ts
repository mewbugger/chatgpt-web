import {GptVersion} from "@/app/constants";

export interface Dialog {
    // 头像
    avatar: string;
    // 小标题
    subTitle: string;
    // 对话最后时间
    timestamp: number;
    // 聊天头
    title: string;
    // 消息数
    count: number;
}

export interface Message {
    // 头像
    avatar: string;
    // 消息内容
    content: string;
    // 信息类型，文本，图片，链接
    message_type: MessageType;
    // 数字类型，表示Unix时间戳
    time: number;
    // 该信息是发送还是接收的
    direction?: MessageDirection;
    // 消息角色
    role: MessageRole;
    // 消息的唯一标识符
    id: string;
    // 是否为流式信息
    streaming?: boolean;
}

export interface SessionConfig {
    gptVersion: GptVersion;
}

export enum MessageRole {
    // 系统消息
    system = "system",
    // 用户消息
    user = "user",
    // 助手（或机器人）消息
    assistant = "assistant",
}

export enum MessageType {
    // 链接消息
    Link = "link",
    // 图片消息
    Pic = "pic",
    // 文本消息
    Text = "text",
}

export enum MessageDirection {
    // 发送的消息
    Send = 0,
    // 接收的消息
    Receive,
}
