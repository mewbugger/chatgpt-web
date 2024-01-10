"use client";
import styles from "./home.module.scss";
import {SideBar} from "../../components/sidebar/sidebar";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import dynamic from "next/dynamic";
const Chat = dynamic(async () => (await import("@/app/pages/chat/chat")).Chat, { ssr: false });
const Role = dynamic(async () => (await import("@/app/pages/role/role")).Role, { ssr: false });

import {Path} from "@/app/constants";
import { useAppConfig } from "../../store/config";


function Screen() {
    const config = useAppConfig();
    return (
        <div className={`${config.tightBorder ? styles["tight-container"] : styles.container}`}>
            {/* 工具菜单 */}
            <SideBar/>

            {/* 路由地址 */}
            <div className={styles["window-content"]}>
                <Routes>
                    <Route path={Path.Home} element={<Chat/>}/>
                    <Route path={Path.Chat} element={<Chat/>}/>
                    <Route path={Path.Role} element={<Role/>}/>
                </Routes>
            </div>
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