import {useState} from "react";
import {DialogType} from "@/types/chat";
import {DialogListItem} from "./dialog-item"
import {DialogResizeableSidebar} from "./dialog-resizeable-sidebar"
import styles from "./dialog-head.module.scss"
export function DialogList() {
    // 使用useState钩子管理对话数组
    const [dialogs, setDialogs] = useState<DialogType[]>([]);
    // 使用useState钩子管理当前选中的对话
    const [selected, setSelected] = useState<DialogType>();

    // 测试数据
    const dialog01: DialogType = {
        avatar: '/role/bugstack.png',
        dialogId: 123,
        read: true,
        subTitle: '写个java冒泡排序?',
        timestamp: Date.now(),
        title: '普通对话',
        count: 1
    };

    // 测试数据
    const dialog02: DialogType = {
        avatar: '/role/interview.png',
        dialogId: 124,
        read: true,
        subTitle: 'Hello, how are you?',
        timestamp: Date.now(),
        title: '面试官',
        count: 5
    };

    dialogs.push(dialog01);
    dialogs.push(dialog02);

    // 渲染对话列表
    return (
        // DialogResizeableSidebar 用于调整对话栏的大小
        <DialogResizeableSidebar>
            {/* 对话列表头部，包含搜索框和创建会话按钮 */}
            <div className={styles["dialog-head"]}>
                <div className={styles["dialog-search-box"]}><input type="text" placeholder="搜索"/></div>
                <div className={styles["dialog-search-add"]} onClick={() => {
                    alert("创建会话");

                    // 定义新对话数据 心理咨询
                    const dialog03: DialogType = {
                        avatar: '/role/psychological.png',
                        dialogId: 125,
                        read: true,
                        subTitle: '吹灭别人的灯，不能照亮自己',
                        timestamp: Date.now(),
                        title: '心里咨询',
                        count: 100
                    };

                    // 将新对话添加到dialogs数组的开始位置
                    dialogs.unshift(dialog03);

                    // 设置新对话为选中状态
                    setSelected(dialog03);
                }}></div>
            </div>
            {/*对话列表*/}
            <div>
                {/*循环遍历数据，当有数据变更时会自动刷新到页面*/}
                {dialogs.map((dialog, index) => (
                    <DialogListItem
                        key={dialog.dialogId}
                        dialog={dialog}
                        selected={selected?.dialogId === dialog.dialogId}
                        onClick={() => {
                            setSelected(dialog)
                            alert("选中对话" + dialog.title)
                        }}
                    />
                ))}
            </div>
        </DialogResizeableSidebar>
    );

}