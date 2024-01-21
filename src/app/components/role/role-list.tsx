import styles from "./role-list.module.scss";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import React from "react";
import {Role} from '@/types/role';
import {DialogResizeableSidebar} from "@/app/components/dialog/dialog-resizeable-sidebar";
import {Avatar, Spin} from "antd";
import {DialogHead} from "@/app/components/dialog/dialog-head";

export interface RoleContextType {
    roles: Role[]
    selected: number;
    setSelected: (id: number) => void;
}

export const RoleContext = React.createContext<RoleContextType>({
    roles: [],
    selected: -1,
    setSelected: (id: number) => {
    }
})

export function RoleList() {
    // 使用 useNavigate 钩子来获取一个导航函数
    const navigate = useNavigate();
    // 从 RoleContext 获取角色列表、选中的角色ID及更新函数
    const {roles, selected, setSelected} = useContext(RoleContext);

    return (
        <DialogResizeableSidebar>
            {/*头部操作*/}
            <DialogHead/>
            {/*角色列表*/}
            <div className={styles["role-list"]}>
                {/* 加载中的旋转指示器 */}
                {!roles ? <Spin spinning style={{margin: '24px auto', width: '100%'}}/> : null}
                {/* 映射 roles 数组，渲染每个角色项 */}
                {/*
                    使用.map()函数遍历roles数组，为每个角色创建一个带有点击事件的列表项。
                    点击角色项时，更新选中的角色，并导航到该角色的详细页面
                */}
                {roles?.map((role) => (
                    <div
                        className={`${styles["role-item"]} ${selected == role.id ? styles['selected'] : ''}`}
                        key={role.id}
                        onClick={() => {
                            setSelected(role.id)
                            navigate(`/role/${role.id}`);
                        }}>

                        <Avatar shape="square" size={38} src={role.avatar}/>
                        <div className={styles["name"]}>{role.role_name}</div>
                    </div>
                ))}
            </div>
        </DialogResizeableSidebar>
    );

}
