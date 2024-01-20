import { useCallback, useEffect, useRef, useState } from "react";

function useScrollToBottom() {
    /**
     * useRef可用于直接访问一个DOM元素
     * 在需要从DOM节点读取值或者直接操作DOM时特别有用
     * useReFf可以用来存储一个值，这个值可以在组件的整个生命周期内改变而不触发组件重新渲染
     */
    // for auto-scroll
    // 使用useRef创建一个ref对象，用于引用一个DOM元素
    const scrollRef = useRef<HTMLDivElement>(null);
    // 使用useState管理自动滚动的状态
    const [autoScroll, setAutoScroll] = useState(true);
    // 使用useCallback创建一个记忆化的回调函数，用于滚动到底部
    const scrollToBottom = useCallback(() => {
        const dom = scrollRef.current;
        if (dom) {
            // 使用requestAnimationFrame确保滚动操作在下一次重绘前执行
            requestAnimationFrame(() => dom.scrollTo(0, dom.scrollHeight));
        }
    }, []);

    // auto scroll
    // 使用useEffect实现自动滚动的副作用
    useEffect(() => {
        // 如果 autoScroll 为 true，调用 scrollToBottom 函数
        autoScroll && scrollToBottom();
    });

    // 返回ref对象和一些控制方法
    return {
        // 返回ref对象，以便外部组件可以将其附加到DOM元素
        scrollRef,
        // 返回当前的自动滚动状态
        autoScroll,
        // 返回一个函数 用于设置自动滚动状态
        setAutoScroll,
        // 返回一个函数 可以手动触发滚动到底部
        scrollToBottom,
    };
}
export default useScrollToBottom
