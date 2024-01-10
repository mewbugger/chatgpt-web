import styles from './dialog-message-item.module.scss'
import {Avatar, Space} from "antd";
import {Message, MessageRole, MessageDirection} from "@/types/chat";
import {RefObject} from "react";


interface Props {
    message: Message;
    //parentRef?: RefObject<HTMLDivElement>;

}
export function DialogMessageItem(props: Props) {
    const {message} = props;
    const isReceive = message.direction === MessageDirection.Receive;
    return (
        <Space className={`${styles.messageWrapper} ${isReceive ? styles.receive : styles.send}`}>
            {isReceive ? (
                <>
                    <Avatar shape="square" src={message.avatar} size={40} style={{
                        borderRadius: '4px',
                        backgroundColor: '#f6f6f6'
                    }}/>
                    <p className={styles.message}>{message.content}</p>
                </>
            ) : (
                <>
                    <p className={styles.message}>{message.content}</p>
                    <Avatar shape="square" src={message.avatar} size={40} style={{
                        borderRadius: '4px',
                        backgroundColor: '#f6f6f6'
                    }}/>
                </>
            )}
        </Space>
    );
}