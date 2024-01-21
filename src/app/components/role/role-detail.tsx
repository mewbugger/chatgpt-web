import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useMemo} from "react";
import {RoleContext} from "@/app/components/role/role-list";
import {createNewMessage, userChatStore} from "@/app/store/chat-store";
import styles from "./role-detail.module.scss";
import {Avatar, Button, Tag} from "antd";
import {MessageRole} from "@/types/chat";

interface Props {
    id: number;
    title: string;
}

export function RoleDetail() {
    // 使用useParams钩子获取路由参数中的id
    /**
     * 用于获取定义在路由路径中的参数，如 /user/:id 中的 id。
     */
    const {id} = useParams<{ id: any }>()
    // 使用useContext钩子获取RoleContext中的角色数据
    const {roles} = useContext(RoleContext);
    // 获取userChatStore中的状态和方法
    const chatStore = userChatStore();
    const navigate = useNavigate();
    const [sessions, currentSessionIndex] = userChatStore(
        (state) => [state.sessions, state.currentSessionIndex, state.selectSession]
    );
    // 查找当前id对应的角色
    const role = useMemo(() => {
        return roles.find((role) => role.id == id);
    }, [id, roles])
    // 开始对话的函数
    const start = () => {
        let session = chatStore.openSession({
            title: role?.role_name,
            avatar: role?.avatar
        });
        setTimeout(() => {
            const newMessage = createNewMessage(role?.description || '', MessageRole.user)
            // 带着角色信息对话
            chatStore.onSendMessage(newMessage)
            // 点击时跳转到对应的界面，并传递必要参数信息
            navigate(`/chat/${session.id}`, {state: {title: session.dialog.title}});
        }, 0)
    }

    // 渲染角色详情页面
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>{role?.role_name}</div>
            <div className={styles.scroll}>
                <Avatar shape="square" size={64} src={role?.avatar}/>
                <p className={styles.desc}>
                    <Tag bordered={false} color="processing">
                        角色介绍
                    </Tag>
                    {role?.description}
                </p>
                <Button type="primary" className={styles['btn']} onClick={() => start()}>开始对话</Button>
            </div>
        </div>
    );

}

