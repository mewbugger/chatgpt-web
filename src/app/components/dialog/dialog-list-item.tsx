import styles from './dialog-list-item.module.scss';
import {Avatar, Badge, Button, Space} from 'antd';
import {ChatSession} from "@/app/store/chat-store";
import DeleteIcon from "@/app/icons/delete.svg";

interface Props {
    session: ChatSession;
    selected: boolean;
    onClick: () => void;
    onClickDelete: () => void;
}

/**
 * 对话框列表对象元素
 * @constructor
 */
// 定义 DialogListItem 组件
export function DialogListItem(props: Props) {
    // 从props中提取session和selected属性
    const {session, selected} = props;
    // 获取当前会话的对话对象
    const dialog = session.dialog;
    // 将会话的时间戳转换为日期对象，并格式化时间字符串
    const date = new Date(dialog.timestamp);
    const timeString = date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
    // 渲染组件
    return (
        // 容器div，根据selected属性应用不同的样式
        <div className={`${styles.wrapper} ${selected ? styles.selected : ''}`} onClick={() => props.onClick()}>
            {/* 左侧部分，包括头像和未读消息徽章 */}
            <div className={styles.left}>
                <Space size={24}>
                    {/* Badge 是 React 提供的组件，这里控制只有选中的才展示对话数 */}
                    <Badge count={props.selected ? dialog.count : 0} size={"small"} color={"#fca7a7"}>
                        {/* Avatar 组件显示会话头像 */}
                        <Avatar shape={"square"} src={dialog.avatar} size={40}/>
                    </Badge>
                </Space>
            </div>
            {/* 右侧部分，包括标题、时间和副标题 */}
            <div className={styles.right}>
                <div className={styles.line1}>
                    {/* 显示会话标题 */}
                    <p className={styles.title}>{dialog.title}</p>
                    {/* 显示格式化的会话时间 */}
                    <p className={styles.time}>{timeString}</p>
                </div>
                <div className={styles.line2}>
                    {/* 显示会话副标题 */}
                    {dialog.subTitle}
                </div>
            </div>
            {/* 删除按钮，点击时触发 onClickDelete 事件 */}
            <div className={styles["chat-item-delete"]} onClickCapture={props.onClickDelete}>
                <DeleteIcon style={{ width: '25px', height: '25px' }}/>
            </div>
        </div>
    );
}
