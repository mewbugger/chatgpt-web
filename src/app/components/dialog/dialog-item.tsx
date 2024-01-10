import styles from './dialog-item.module.scss';
import {Avatar, Badge, Button, Space} from 'antd';
import {DialogType} from "@/types/chat"
//import {ChatSession} from "@/app/store/chat-store";
import DeleteIcon from "@/app/icons/delete.svg";

// interface Props {
//     session: ChatSession;
//     selected: boolean;
//     onClick: () => void;
//     onClickDelete: () => void;
// }

// 定义组件接收的属性类型
interface Props {
    dialog: DialogType; // 对话框类型的对象
    selected: boolean;  // 标记是否被选中
    onClick: () => void; // 点击事件的处理函数
}

/**
 * 对话框列表对象元素
 * @constructor
 */
export function DialogListItem(props: Props) {
    // 从props中解构出dialog，selected和onClick
    const {dialog, selected, onClick} = props;
    // 将对话框的时间戳转换成日期对象
    const date = new Date(dialog.timestamp);
    // 格式化时间字符串
    const timeString = date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
    // 渲染对话框列表项
    return (
        // 根据selected属性动态添加类名以改变样式，并绑定点击事件
        <div className={`${styles.wrapper} ${selected ? styles.selected : ''}`} onClick={() => onClick()}>
            {/* 左侧内容区 */}
            <div className={styles.left}>
                <Space size={24}>
                    {/* Badge 是 React 提供的组件，这里控制只有选中的才展示对话数 */}
                    <Badge count={props.selected ? dialog.count : 0} size={"small"} color={"#fca7a7"}>
                        <Avatar shape={"square"} src={dialog.avatar} size={40}/>
                    </Badge>
                </Space>
            </div>
            {/* 右侧内容区 */}
            <div className={styles.right}>
                {/* 第一行内容，包含标题和时间 */}
                <div className={styles.line1}>
                    <p className={styles.title}>{dialog.title}</p>
                    <p className={styles.time}>{timeString}</p>
                </div>
                {/* 第二行内容，显示对话的子标题或最后一条消息的预览 */}
                <div className={styles.line2}>
                    {dialog.subTitle}
                </div>
            </div>
        </div>
    );
}
