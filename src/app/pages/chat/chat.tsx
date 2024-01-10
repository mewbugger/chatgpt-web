import styles from './chat.module.scss';
import {Outlet} from 'react-router-dom';
import {DialogList} from "../../components/dialog/dialog-list"

export function Chat() {
    return (
        <div className={styles["chat"]}>
            <DialogList/>
            <Outlet/>

        </div>
    );
}