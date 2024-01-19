import styles from './role.module.scss'
// 引入 React 的钩子函数
import {useEffect, useState} from "react";
import {Role} from "@/types/role"
import {getRoleList} from "@/apis";
import {RoleContext, RoleList} from "@/app/components/role/role-list";
// 引入 React Router 的 Outlet 组件
import {Outlet} from "react-router-dom";

// 定义Role组件
export function Role() {
    // 使用useState钩子管理角色列表和选中的角色ID
    /**
     * useState是React中的一个钩子（Hook），用于在函数组件中添加状态管理。
     * 在类组件中，状态是通过this.state和this.setState管理的
     * 函数组件中，useState提供了相似的功能
     */
    const [roles, setRoles] = useState<Role[]>([])
    const [selected, setSelected] = useState<number>(-1);

    /**
     * useEffect是用于处理副作用（side effects）的钩子。
     * 在类组件中，副作用通常在'componentDidMount','componentDidUpdate','componentWillUnmount'
     * 生命周期方法中处理
     * useEffect提供了一种在函数组件中执行副作用的方式
     */
    // 使用useEffect钩子在组件加载时获取角色列表
    useEffect(() => {
        getRoleList().then((res) => {
            setRoles(res?.roles);   // 将获取的角色列表设置到状态中
        });
        // 依赖数组为空，这个效果只会在组件加载时运行一次
        // 如果依赖数组不为空，那么这个效果会在依赖数组变化的时候运行
    }, [])

    return (
        <div className={styles["role"]}>
            <RoleContext.Provider value={{roles, selected, setSelected}}>
                <RoleList/>
                {/*在父级路由中定义一个占位符*/}
                {/*React Router 的 Outlet，用于渲染嵌套路由的组件*/}
                <Outlet/>
            </RoleContext.Provider>
        </div>
    );
}
