import { Button, Input } from "antd";
import styles from "./auth.module.scss";

import { useNavigate } from "react-router-dom";
import { useAccessStore } from "../../store/access";
import ChatGPTIcon from "../../icons/chatgpt.svg";
// 定义Auth组件
export function Auth() {
    // 使用useNavigate钩子获取导航函数
    // useNavigate钩子函数运行用户在应用的任何位置编程式地进行页面跳转
    const navigate = useNavigate();
    // 获取自定义状态存储中的状态和方法
    /**
     * useAccessStore的结构
     * token: "",
     * accessCode: "",
     * accessCodeErrorMsgs: "",
     */
    const access = useAccessStore();
    // 渲染组件
    return (
        <div className={styles["auth-page"]}>
            <ChatGPTIcon/>
            <div className={styles["auth-title"]}>OpenAIhub</div>
            <div className={styles["auth-sub-title"]}>
                学习AI开发、掌握AI部署、运用AI提效
            </div>
            <img
                src="/role/qrcode.jpg"
                style={{ width: 250 }}
            />{/* 显示二维码图片 */}
            <div className={styles["auth-tips"]}>
                扫码关注公众号【妄言妄语】，
                <a
                    href="/role/qrcode.jpg"
                    target="_blank"
                >
                    回复【403】获取访问密码
                </a>{/* 提供获取访问密码的信息 */}
            </div>

            <Input
                className={styles["auth-input"]}
                type="password"
                placeholder="在此处填写访问码"
                value={access.accessCode}
                onChange={(e) => {
                    access.updateCode(e.currentTarget.value);
                }}
                status={access.accessCodeErrorMsgs?'error': ''}

            />
            {access.accessCodeErrorMsgs?<span className={styles['auth-error']}>{access.accessCodeErrorMsgs}</span>:null}


            <div className={styles["auth-actions"]}>
                <Button type="primary" onClick={() => access.login()}>确认登录👣</Button>
                <Button type="text">稍后再说</Button>
            </div>
            <span>
        说明：此平台主要以学习OpenAI为主，请合理、合法、合规的使用相关资料！
      </span>
        </div>
    );
}
