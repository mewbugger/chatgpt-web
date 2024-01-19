"use client";
import styles from "./home.module.scss";
import { SideBar } from "../../components/sidebar/sidebar";
import { DialogMessage } from "@/app/components/dialog/dialog-message";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import dynamic from "next/dynamic";
import { Path } from "@/app/constants";
import { useAppConfig } from "../../store/config";
import { RoleDetail } from "@/app/components/role/role-detail";
import { useAccessStore } from "@/app/store/access";

const Chat = dynamic(async () => (await import("../chat/chat")).Chat);
const Role = dynamic(async () => (await import("../role/role")).Role);
const Auth = dynamic(async () => (await import("../auth/auth")).Auth);



function Screen() {
    /**
     * 使用useAppConfig和useAccessStore钩子从'zustand'状态存储中获取应用配置和访问控制信息
     */
    // 从配置状态存储中获取配置
    const config = useAppConfig();
    // 从访问控制状态存储中获取访问信息
    const access = useAccessStore();
    // 获取当前的URL信息 基于该位置决定渲染哪个组件
    const location = useLocation();
    // 检查当前路径是否为授权路径 如果用户未授权或处于授权页面，渲染'Auth'组件
    const isAuthPath = location.pathname === '/auth';
    // 检查用户是否已授权
    const isAuthorized = access.isAuthorized()

    return (
        <div
            // 如果在授权页面或者未授权，则渲染Auth组件
            className={`${
                config.tightBorder ? styles["tight-container"] : styles.container
            }`}
        >
            {isAuthPath || !isAuthorized ? (
                <Auth />
            ) : (
                <>
                    {/* 工具菜单 */}
                    <SideBar />

                    {/* 路由地址 */}
                    <div className={styles["window-content"]}>
                        <Routes>
                            <Route path={Path.Home} element={<Chat />} />
                            <Route path={Path.Chat} element={<Chat />}>
                                <Route path=":id" element={<DialogMessage />} />
                            </Route>
                            <Route path={Path.Role} element={<Role />}>
                                <Route path=":id" element={<RoleDetail />} />
                            </Route>
                        </Routes>
                    </div>
                </>
            )}
        </div>
    );

}

export function Home() {
    return (
        <Router>
            <Screen/>
        </Router>
    );
}