import logo from './kishi.png';
import './App.css';
import React, { useEffect, useState } from 'react';

function SimpleFetch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/hello') // サンプルAPIのエンドポイント
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTPエラーです！ステータス: ${response.status}`);
        }
        return response.json(); // レスポンスをJSONとして解析
      })
      .then(jsonData => {
        setData(jsonData); // 取得したデータをstateに保存
        setLoading(false); // ローディング完了
      })
      .catch(error => {
        setError(error); // エラーをstateに保存
        setLoading(false); // ローディング完了（エラー発生時も）
      });
  }, []); // 空の依存配列で初回レンダリング時のみ実行

  if (loading) {
    return <p>データをロード中です...</p>;
  }

  if (error) {
    return <p>データの取得に失敗しました: {error.message}</p>;
  }

  if (data) {
    return (
          <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello Mizuki!
        </p>
        <pre>{data.message}</pre>
        {/* <input
          type="text"
          id="roomId"
          value={roomId} // stateとinput要素の値を紐付け
          onChange={handleChange} // 入力値が変更されたときのイベントハンドラー
        /> */}
        {/* <button onClick={submitRoomId}>決定</button> */}
      </header>
    </div>
    );
  }

  return null; // まだデータがない場合の初期表示
}

function App() {
  return SimpleFetch();
}

export default App; 
