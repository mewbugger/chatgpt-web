export async function copyToClipboard(text: string) {
    // 使用navigator.clipboard.writeText 异步地将文本复制到剪贴板
    await navigator.clipboard.writeText(text);
}

export function prettyObject(msg: any) {
    // 保存原始的msg变量
    const obj = msg;
    // 如果msg不是字符串类型，则将其转换为格式化的JSON字符串
    if (typeof msg !== "string") {
        msg = JSON.stringify(msg, null, "  ");
    }
    // 如果转换后的msg是一个空对象的JSON字符串，则返回原始对象的字符串表示
    if (msg === "{}") {
        return obj.toString();
    }
    if (msg.startsWith("```json")) {
        return msg;
    }
    return ["```json", msg, "```"].join("\n");
}
