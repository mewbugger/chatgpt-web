import {MessageRole} from "@/types/chat";
import {GptVersion} from "@/app/constants";
import {useAccessStore} from "@/app/store/access";

const host = 'http://localhost:8090'


/**
 * 获取Header 信息
 */
function getHeaders() {
    // 从useAccessStore中获取当前的访问状态
    const accessState = useAccessStore.getState()
    // 定义请求头，包括授权令牌和内容类型
    const headers =  {
        // 设置授权令牌
        Authorization:  accessState.token,
        // 设置内容类型为 JSON
        'Content-Type': 'application/json;charset=utf-8'
    }
    // 返回构造的请求头
    return headers
}

export const getRoleList = () => {
    // 从 apiPost mock 接口获取
    // return fetch(`${host}/role/list`).then((res) =>
    //     res.json()
    // );

    // 实际使用的代码是从本地的 JSON 文件获取数据
    return fetch('/prompts.json').then((res) =>
        res.json()
    );
}


/**
 * 流式应答接口
 * @param data
 */
export const completions = (data: {
    messages: {content: string; role: MessageRole}[],
    model: GptVersion
}) => {
    return fetch(`${host}/api/v1/chatgpt/chat/completions`, {
        method: 'post',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
};


/**
 * 登录鉴权接口
 * @param token
 */
export const login = (token: string) => {
    // 从 useAccessStore 获取当前的访问状态
    const accessState = useAccessStore.getState()
    return fetch(`${host}/api/v1/auth/login`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `code=${accessState.accessCode}`
    });
};
