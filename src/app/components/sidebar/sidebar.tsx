import {useNavigate} from "react-router-dom";
import styles from "./sidebar.module.scss";
import ChatGPTIcon from "../../icons/chatgpt.svg";
import ChatIcon from "../../icons/chat.svg";
import RoleIcon from "../../icons/role.svg";
import ExitIcon from "../../icons/exit.svg";
import MinIcon from "../../icons/min.svg";
import MaxIcon from "../../icons/max.svg";
import SaleIcon from "../../icons/sale.svg";
import {useAccessStore} from "@/app/store/access";



import {Path} from "../../constants";
import {IconButton} from "../button/button";
import {useAppConfig} from "../../store/config"

export function SideBar() {
    // 使用useNavigate钩子来获取一个导航函数，用于页面跳转
    const navigate = useNavigate();
    // 使用自定义钩子useAppConfig来获取应用配置
    const config = useAppConfig();

    // 渲染侧边栏组件
    return (
        <div className={styles.sidebar}>
            {/* 操作按钮区域 */}
            <div className={styles["action-button"]}>
                {/* 第一个IconButton用于展示退出图标 */}
                <IconButton icon={<ExitIcon/>} backgroundColor={"#ff4e4e"} onClick={() => {
                    const accessState = useAccessStore.getState()
                    accessState.goToLogin()
                }}/>
                {/* 第二个IconButton用于最小化操作 */}
                <IconButton icon={<MinIcon/>} backgroundColor={"#f3c910"} onClick={() => {
                    config.update(
                        (config) => (config.tightBorder = false),
                    );
                }}/>
                {/* 第三个IconButton用于最大化操作 */}
                <IconButton icon={<MaxIcon/>} backgroundColor={"#04c204"} onClick={() => {
                    config.update(
                        (config) => (config.tightBorder = true),
                    );
                }}/>
            </div>
            {/* 侧边栏头部，展示ChatGPT图标 */}
            <div className={styles["sidebar-header"]}>
                <ChatGPTIcon style={{ width: '40px', height: '40px' }}/>
            </div>
            {/* 聊天图标，点击导航到聊天页面 */}
            <div className={styles["sidebar-chat"]}
                 onClick={() => {
                     navigate(Path.Chat)
                 }}>
                <ChatIcon style={{ width: '25px', height: '25px' }}/>
            </div>
            {/* 角色选择图标，点击导航到角色选择页面 */}
            <div className={styles["sidebar-role"]}
                 onClick={() => {
                     navigate(Path.Role)
                 }}>
                <RoleIcon style={{ width: '25px', height: '25px' }}/>
            </div>
            <div className={styles["sidebar-mall"]}
                 onClick={() => {
                     navigate(Path.Sale)
                 }}>
                <SaleIcon style={{ width: '25px', height: '25px' }}/>
            </div>


        </div>
    )
}