import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login } from "@/apis";
export interface AccessControlStore {
    // 存储访问码
    accessCode: string;
    // 存储授权令牌
    token: string;
    // 存储访问码错误信息
    accessCodeErrorMsgs: string;
    // 更新令牌的方法
    updateToken: (_: string) => void;
    // 更新访问码的方法
    updateCode: (_: string) => void;
    // 检查是否已经授权的方法
    isAuthorized: () => boolean;
    // 登录操作的方法
    login: () => Promise<string>;
    // 执行登录过程的方法
    goToLogin: () => void;
}

export const useAccessStore: any = create<AccessControlStore>()(
    persist(
        (set, get) => ({
            // 初始化操作
            token: "",
            accessCode: "",
            accessCodeErrorMsgs: "",
            // 更新accessCode的方法
            updateCode(code: string) {
                set(() => ({ accessCode: code }));
            },
            // 更新token的方法
            updateToken(token: string) {
                set(() => ({ token }));
            },
            // 检查是否已授权（token是否存在）
            isAuthorized() {
                return !!get().token;
            },
            // 重置访问码和令牌，用于登录流程
            goToLogin() {
                get().updateCode("");
                get().updateToken("");
            },
            // 异步登录方法
            async login() {
                // 调用登录API
                const res = await login(get().accessCode);
                const { data, code } = await res.json();
                // 这里需要根据返回结果设置
                if (code === "0000") {
                    // 登录成功，更新token
                    get().updateToken(data);
                    // 清空错误信息
                    set(() => ({ accessCodeErrorMsgs: "" }));
                }
                if (code === "0002") {
                    set(() => ({ accessCodeErrorMsgs: "验证码已过期,请获取最新验证码" }));
                }
                if (code === "0003") {
                    set(() => ({ accessCodeErrorMsgs: "验证码不存在,请确认最新验证码" }));
                }
                return data;
            },
        }),
        {
            // 持久化存储的名称
            name: "chat-access",
            // 持久化版本
            version: 1,
        }
    )
);
