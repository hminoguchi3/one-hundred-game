
const callPostRequest = async (req, url) => {
    const response = await
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 送信するデータの形式を指定
            },
            body: JSON.stringify(req), // JavaScriptオブジェクトをJSON文字列に変換して送信
        });
    if (!response.ok) {
        throw new Error(`HTTPエラーです！ステータス: ${response.status}`);
    }
    return response.json()
};

export const callPostRoomAndUserIdApi = (enterRoomRequest) => {
    return callPostRequest(enterRoomRequest, 'http://localhost:5000/api/room')
};