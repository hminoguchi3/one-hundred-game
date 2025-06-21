import '../App.css';
import { API_BASE_URL } from './constants';

async function getErrorMessage(response) {
    const errorMessage = await response.text();
    return `HTTPエラーです！ステータス: ${response.status}, メッセージ: ${errorMessage}`;
}

function getApiHeaders() {
    return {
        'Content-Type': 'application/json', // 送信するデータの形式を指定
    };
}

export async function getUsersInRoomApi(roomId) {
    const response = await fetch(`${API_BASE_URL}/api/room/${roomId}/users`, {
        method: 'GET',
        headers: getApiHeaders(),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
}

// DEPRECATED - using socket instead.
export async function enterRoomApi(userId, roomId) {
    const accessRoomRequest = { userId: userId, roomId: roomId };

    const response = await fetch(`${API_BASE_URL}/api/room`, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(accessRoomRequest), // JavaScriptオブジェクトをJSON文字列に変換して送信
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
}