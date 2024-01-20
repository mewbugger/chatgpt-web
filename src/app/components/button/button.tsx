import styles from "./button.module.scss";

/**
 * 定义通用按钮函数 IconButton
 * @param props.onClick 按钮事件(可选)
 * @param props.icon 图标(可选)
 * @param props.className CSS 样式
 * @param props.title 图标名称
 * @param props.text 图标说明
 * */
export function IconButton(props: {
    // 可选 点击事件的回调函数
    onClick?: () => void;
    // 可选 表示按钮的图标
    icon?: JSX.Element;
    // 可选 自定义CSS类名
    className?: string;
    // 可选 按钮的标题
    title?: string;
    // 可选 按钮的文字说明
    text?: string;
    // 可选 按钮的背景颜色
    backgroundColor?: string;
}) {
    // 从props中解构出backgroundColor属性
    const {backgroundColor} = props;

    // 定义按钮的内联样式，这里主要是设置背景色
    const buttonStyle = {
        backgroundColor: backgroundColor,
    };

    // 渲染按钮
    return (
        // 使用传入的className样式，并应用定义的内联样式
        <button className={styles["icon-button"]} style={buttonStyle} onClick={props.onClick}>
            {props.icon && <div className={styles["icon-button-icon"]}>{props.icon}</div>}
            {props.text && <div className={styles["icon-button-text"]}>{props.text}</div>}
        </button>
    );
}