import React from "react";
import {Role} from "@/types/role";
// 角色信息上下文
export interface RoleContextType {
    // 存储多个角色信息
    roles: Role[];
    // 选中的角色的ID，数字类型
    selected: number;
    // 函数，用于设置选中的角色的ID
    setSelected: (id: number) => void;
}

// 创建一个名为RoleContext的上下文对象
export const RoleContext = React.createContext<RoleContextType>({
    // 初始roles为空数组
    roles: [],
    // 初始化selected为-1，表示没有角色被选中
    selected: -1,
    setSelected: (id: number) => {
    }
})
