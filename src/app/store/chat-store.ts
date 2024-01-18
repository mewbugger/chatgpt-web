import {create} from "zustand";
import {persist} from "zustand/middleware";
import {Dialog, Message, MessageDirection, MessageRole, MessageType, SessionConfig} from "@/types/chat";
import {GptVersion} from "@/app/constants";
import {nanoid} from "nanoid";
import {completions} from "@/apis";
import {useAccessStore} from "@/app/store/access";

interface ChatStore {
    // 会话的全局ID
    id: number;
    // 存储所有会话的数组
    sessions: ChatSession[];
    // 当前活动会话的索引
    currentSessionIndex: number;
    // 打开一个新的会话
    openSession: (dialog?: { avatar?: string; title?: string }) => ChatSession;
    // 选择一个会话
    selectSession: (index: number) => void;
    // 删除一个会话
    deleteSession: (index: number) => void;
    // 获取当前会话
    currentSession: () => ChatSession;
    // 发送信息
    onSendMessage: (newMessage: Message) => Promise<void>;
    // 更新当前会话
    updateCurrentSession: (updater: (session: ChatSession) => void) => void;
    // 重试操作
    onRetry: () => void;
    // 删除消息
    deleteMessage: (message: Message) => void;
    // 创建新消息
    createNewMessage: (value: string) => Message;
}

export interface ChatSession {
    // 会话ID
    id: number;
    // 对话框体
    dialog: Dialog;
    // 对话消息
    messages: Message[];
    // 会话配置
    config: SessionConfig;
    // 清除会话的索引
    clearContextIndex?: number;
}

/**
 * 创建并返回一个新的ChatSession对象
 * @param dialog
 */
function createChatSession(dialog?: {
    avatar?: string;
    title?: string;
}): ChatSession {
    return {
        id: 0,
        dialog: {
            avatar: dialog?.avatar || "/role/wali.png",
            title: dialog?.title || "新的对话",
            count: 0,
            subTitle: "请问有什么需要帮助的吗？",
            timestamp: new Date().getTime(),
        },
        messages: [
            {
                avatar: dialog?.avatar || "/role/wali.png",
                content: "请问有什么需要帮助的吗？",
                message_type: MessageType.Text,
                time: Date.now(),
                direction: MessageDirection.Receive,
                role: MessageRole.system,
                id: nanoid()
            }
        ],
        clearContextIndex: undefined,
        config: {
            gptVersion: GptVersion.GPT_3_5_TURBO,
        }
    };
}

/**
 * 格式化消息，如果消息超过一定数量，只保留最近的几条
 * @param messages
 */
function formatMessages(messages: Message[]) {
    // 如果历史消息超过5，只取最新的3个
    const latestMessages = messages.length > 3 ? messages.slice(-3) : messages; // 获取最新的三个消息，如果 messages 长度小于等于 3，则返回全部消息
    return latestMessages.map(({content, role}) => ({
        content,
        role,
    }));
}

/**
 * 创建并返回新的Message对象
 * @param value
 * @param role
 */
export function createNewMessage(value: string, role?: MessageRole) {
    return {
        avatar: role !== MessageRole.user ? "/role/wali.png" : "/role/runny-nose.png",
        content: value,
        time: Date.now(),
        role: role || MessageRole.user,
        id: nanoid(),
        streaming: false,
    } as Message;
}

export const userChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            // 初始化
            id: 0,
            sessions: [createChatSession()],
            currentSessionIndex: 0,

            // 开启会话
            openSession(dialog?: { avatar?: string; title?: string }) {
                // 创建一个新会话
                const session = createChatSession(dialog);
                // 每开启一个会话，就对应设置一个对话ID，ID自增1
                set(() => ({id: get().id + 1}));
                // 设置新会话的ID
                session.id = get().id;

                // 将新会话添加到session数组的开头
                set((state) => ({
                    currentSessionIndex: 0,
                    // 在数组头部插入数据
                    sessions: [session].concat(state.sessions),
                }));
                // 返回新会话
                return session;
            },

            // 选择会话
            selectSession(index: number) {
                set({
                    currentSessionIndex: index,
                });
            },

            // 删除会话
            deleteSession(index: number) {
                const count = get().sessions.length;
                const deleteSession = get().sessions.at(index);

                if (!deleteSession) return;

                const sessions = get().sessions.slice();
                sessions.splice(index, 1);

                // 更新currentSessionIndex
                const currentIndex = get().currentSessionIndex;
                let nextIndex = Math.min(
                    currentIndex - Number(index < currentIndex),
                    sessions.length - 1,
                );

                if (count === 1) {
                    nextIndex = 0;
                    sessions.push(createChatSession());
                }

                set(() => ({
                    currentSessionIndex: nextIndex,
                    sessions,
                }));

            },

            // 获取当前会话
            currentSession() {
                let index = get().currentSessionIndex;
                const sessions = get().sessions;
                if (index < 0 || index >= sessions.length) {
                    index = Math.min(sessions.length - 1, Math.max(0, index));
                    set(() => ({currentSessionIndex: index}));
                }
                return sessions[index];
            },

            // 发送消息
            async onSendMessage(newMessage: Message) {
                const session = get().currentSession();

                // 将新信息添加到当前会话的信息列表
                get().updateCurrentSession((session) => {
                    session.messages = session.messages.concat(newMessage);
                });
                // 获取活跃消息（根据clearContextIndex筛选，如果没有则从头开始）
                const activeMessages = session.messages?.slice(
                    session.clearContextIndex || 0
                );
                // 格式化信息以便发送给API
                const messages = formatMessages(activeMessages);
                // 创建一个系统角色的空消息，作为响应的占位符
                const botMessage: Message = createNewMessage("", MessageRole.system);
                // 将系统消息添加到当前会话的消息列表
                get().updateCurrentSession((session) => {
                    session.messages = session.messages.concat(botMessage);
                });

                // 调用 completions API，发送格式化后的消息，并指定模型版本
                const {body} = await completions({
                    messages,
                    model: session.config.gptVersion,
                });

                // 从响应中读取流式数据
                const reader = body!.getReader();
                const decoder = new TextDecoder();
                // 创建一个可读流来处理数据
                new ReadableStream({
                    start(controller) {
                        async function push() {
                            const {done, value} = await reader.read();
                            if (done) {
                                // 如果读取完成，关闭流
                                controller.close();
                                return;
                            }
                            // 将读取的数据入队
                            controller.enqueue(value);
                            const text = decoder.decode(value);

                            // 权限校验，如果返回 "0003"，则执行登录操作
                            if (text === "0003") {
                                controller.close();
                                useAccessStore.getState().goToLogin();
                            }
                            // 将解码后的文本添加到 botMessage 的内容中
                            botMessage.content += text;
                            // 更新当前会话，添加新的 botMessage
                            get().updateCurrentSession((session) => {
                                session.messages = session.messages.concat();
                            });
                            // 继续读取下一段数据
                            push();
                        }
                        // 开始读取数据
                        push();
                    },
                });
            },

            // 更新当前会话
            updateCurrentSession(updater) {
                const sessions = get().sessions;
                const index = get().currentSessionIndex;
                updater(sessions[index]);
                set(() => ({sessions}))
            },

            onRetry() {
                const session = get().currentSession();
                const activeMessages = session.messages?.slice(session.clearContextIndex || 0);
                const messages = formatMessages(activeMessages);
                completions({messages, model: session.config.gptVersion});
            },

            deleteMessage(message: Message) {
                get().updateCurrentSession((session) => {
                    const index = session.messages.findIndex((m) => m.id === message.id);
                    session.messages.splice(index, 1);
                });
            },

            createNewMessage(value: string, role?: MessageRole) {
                return {
                    avatar: "/role/runny-nose.png",
                    content: value,
                    time: Date.now(),
                    role: MessageRole.user,
                    id: nanoid(),
                } as Message;
            }

        }),
        {
            name: "chat-store"
        }
    ),
);

