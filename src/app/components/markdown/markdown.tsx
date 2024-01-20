import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";
import {useRef, useState, RefObject, useEffect} from "react";
import mermaid from "mermaid";
import React from "react";
import {useDebouncedCallback, useThrottledCallback} from "use-debounce";
import LoadingIcon from "../../icons/three_dot.svg";

/**
 * 用于渲染由Mermaid图表库生成的图表
 * @param props
 * @constructor
 */
export function Mermaid(props: { code: string }) {
    // 创建一个引用用于指向要渲染Mermaid图表的DOM节点
    const ref = useRef<HTMLDivElement>(null);
    // 用于跟踪组件是否遇到渲染错误
    const [hasError, setHasError] = useState(false);

    // 使用useEffect钩子在组件加载和props.code更改时运行
    useEffect(() => {
        // 如果提供了Mermaid代码且ref当前指向一个DOM节点
        if (props.code && ref.current) {
            // 尝试渲染Mermaid图表
            mermaid
                .run({
                    nodes: [ref.current],
                    suppressErrors: true,
                })
                .catch((e) => {
                    // 如果出错，则设置错误状态并记录错误
                    setHasError(true);
                    console.error("[Mermaid] ", e.message);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.code]);

    /**
     * 当点击图表时，将图表在新窗口中以SVG格式打开
     */
    function viewSvgInNewWindow() {
        const svg = ref.current?.querySelector("svg");
        if (!svg) return;
        const text = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([text], {type: "image/svg+xml"});
        const url = URL.createObjectURL(blob);
        const win = window.open(url);
        if (win) {
            win.onload = () => URL.revokeObjectURL(url);
        }
    }

    // 如果有错误，不渲染任何内容
    if (hasError) {
        return null;
    }

    // 渲染组件，将ref关联到div，以便Mermaid可以在其中渲染图表
    return (
        <div
            className="no-dark mermaid"
            style={{
                cursor: "pointer",
                overflow: "auto",
            }}
            ref={ref}
            onClick={() => viewSvgInNewWindow()}
        >
            {props.code}
        </div>
    );
}

/**
 * 识别并渲染Mermaid图表
 * @param props
 * @constructor
 */
export function PreCode(props: { children: any }) {
    // 创新一个ref用于引用<pre>标签
    const ref = useRef<HTMLPreElement>(null);
    // 获取ref当前引用的<pre>标签中的文本内容
    const refText = ref.current?.innerText;
    // 状态用于存储解析后的Mermaid代码
    const [mermaidCode, setMermaidCode] = useState("");

    // 使用去抖动的回调来渲染 Mermaid 图表
    const renderMermaid = useDebouncedCallback(() => {
        if (!ref.current) return;
        // 在 <pre> 标签中寻找 Mermaid 代码块
        const mermaidDom = ref.current.querySelector("code.language-mermaid");
        if (mermaidDom) {
            // 如果找到，更新 mermaidCode 状态
            setMermaidCode((mermaidDom as HTMLElement).innerText);
        }
    }, 600);

    // 当 refText 更改时触发去抖动的回调
    useEffect(() => {
        setTimeout(renderMermaid, 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refText]);

    return (
        <>
            {mermaidCode.length > 0 && (
                <Mermaid code={mermaidCode} key={mermaidCode}/>
            )}
            <pre ref={ref}>
        <span
            className="copy-code-button"
        ></span>
                {props.children}
      </pre>
        </>
    );
}

/**
 * 用于渲染 Markdown 内容。
 * 该组件使用了 ReactMarkdown 库，该库允许将 Markdown 文本转换为 React 组件
 * @param props
 */
function _MarkDownContent(props: { content: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
            rehypePlugins={[
                RehypeKatex,
                [
                    RehypeHighlight,
                    {
                        detect: false,
                        ignoreMissing: true,
                    },
                ],
            ]}
            components={{
                pre: PreCode,
                a: (aProps) => {
                    const href = aProps.href || "";
                    const isInternal = /^\/#/i.test(href);
                    const target = isInternal ? "_self" : aProps.target ?? "_blank";
                    return <a {...aProps} target={target}/>;
                },
            }}
        >
            {props.content}
        </ReactMarkdown>
    );
}

export const MarkdownContent = React.memo(_MarkDownContent);

export function Markdown(
    props: {
        // Markdown 文本内容
        content: string;
        // 是否显示加载中状态
        loading?: boolean;
        // 设置字体大小
        fontSize?: number;
        // 父组件引用
        parentRef?: RefObject<HTMLDivElement>;
        // 默认是否展示
        defaultShow?: boolean;
        // 允许传入任何标准的div属性
    } & React.DOMAttributes<HTMLDivElement>,
) {

    return (
        <div
            // 应用CSS类似设置样式
            className="markdown-body"
            style={{
                fontSize: `${props.fontSize ?? 14}px`,
                direction: /[\u0600-\u06FF]/.test(props.content) ? "rtl" : "ltr",
            }}
        >
            {
                // 如果处在加载状态，则展示图表
                props.loading ?
                    <LoadingIcon style={{width: '25px', height: '25px'}}/>
                    :
                    <MarkdownContent content={props.content}/>
            }
        </div>
    );
}
