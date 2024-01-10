import { PropsWithChildren } from "react";
import { Resizable } from "re-resizable";

// 定义Props接口，包括一个可选的最小宽度属性
interface Props {
    minWidth?: number; // 可选属性，定义侧边栏的最小宽度
}

// DialogResizeableSidebar组件的定义
export function DialogResizeableSidebar(props: PropsWithChildren<Props>) {
    // 从props中解构出winWidth属性，如果未提供则默认为200
    const {minWidth = 200, children} = props;
    // 渲染可调整大小的侧边栏组件
    return (
        // Resizeable组件用于创建可调整大小的元素
        <Resizable
            minWidth={220}
            maxWidth={320}
            defaultSize={{
                width: "100%",
                height: "100%",
            }}
            style={{
                borderRight: '1px solid #f5f5f5'
            }}
        >
            {children}
        </Resizable>
    );
}
