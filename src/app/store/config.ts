import {create} from "zustand";
import {persist} from "zustand/middleware";

/**
 * 配置文件
 * @param tightBorder true/false 是否全框体展示
 */
export const DEFAULT_CONFIG = {
    tightBorder: false,
}

// 定义 ChatConfig类型，与DEFAULT_CONFIG的结构相同
export type ChatConfig = typeof DEFAULT_CONFIG;

// 定义ChatConfigStore类型，包含ChatConfig的所有属性和额外的reset和update方法
export type ChatConfigStore = ChatConfig & {
    reset: () => void;
    update: (updater: (config: ChatConfig) => void) => void;
};

/**
 * create 函数创建了一个 ChatConfigStore 实例，并且通过 export 关键字导出了一个名为 useAppConfig 的常量。
 * ChatConfigStore 是一个自定义的数据存储类，而 useAppConfig 是一个用于在 React 组件中访问和修改 ChatConfigStore 实例的自定义 Hook。
 */
export const useAppConfig = create<ChatConfigStore>()(
    persist(
        // 状态存储的配置函数
        (set, get) => ({
            // 初始化状态为DEFAULT_CONFIG
            ...DEFAULT_CONFIG,

            // reset方法，用于将状态重置为DEFAULT_CONFIG
            reset() {
                set(() => ({...DEFAULT_CONFIG}));
            },

            // update方法，接受一个函数来更新当前状态
            update(updater) {
                // 获取当前状态的副本
                const config = {...get()};
                // 使用updater函数更新状态
                updater(config);
                // 将更新后的状态设置回存储
                set(() => config);
            },
        }),
        {
            // 持久化配置
            name: "app-config",
            version: 2, // 版本号
            // 迁移函数，用于处理不同版本的状态迁移
            migrate(persistedState, version) {
                // 如果版本是2，直接返回状态
                if (version === 2) return persistedState as any;
                // 否则返回ChatConfig类型的状态
                return persistedState as ChatConfig;
            },
        },
    ),
);
