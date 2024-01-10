import styles from "./dialog-message-input.module.scss";
import {useState} from "react";
import {Button, Input} from "antd";


interface Props {
    onEnter: (value: string)  => void;
}
export function DialogMessageInput(props: Props) {
    const {onEnter} = props;
    const [value, setValue] = useState(String);

    const onPressEnter = (e: any) => {
        e.preventDefault();
        onEnter(e.target.value);
        setValue(String);
    }

    return (
        <div className={styles.wrapper}>
            <Input.TextArea
                value={value}
                onChange={(e)=> setValue(e.target.value)}
                className={styles.textarea}
                placeholder={"请输入"}
                autoFocus
                onPressEnter={(e)=>onPressEnter(e)}/>
        </div>
    );


}
