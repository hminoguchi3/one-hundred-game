import logo from './kishi.png';
import './App.css';
import React, { useEffect, useState } from 'react';

function SimpleFetch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetch('http://localhost:5000/api/hello') // サンプルAPIのエンドポイント
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`HTTPエラーです！ステータス: ${response.status}`);
  //       }
  //       return response.json(); // レスポンスをJSONとして解析
  //     })
  //     .then(jsonData => {
  //       setData(jsonData); // 取得したデータをstateに保存
  //       setLoading(false); // ローディング完了
  //     })
  //     .catch(error => {
  //       setError(error); // エラーをstateに保存
  //       setLoading(false); // ローディング完了（エラー発生時も）
  //     });
  // }, []); // 空の依存配列で初回レンダリング時のみ実行


  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    roomId: 'My First Room',
  });

  useEffect(() => {
    try {
      fetch('http://localhost:5000/api/room', { // POST先のURL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 送信するデータの形式を指定
        },
        body: JSON.stringify(formData), // JavaScriptオブジェクトをJSON文字列に変換して送信
      })
        .then(response => {
          if (!response.ok) {
            const errorMessage = response.text();
            throw new Error(`HTTPエラーです！ステータス: ${response.status}, メッセージ: ${errorMessage}`);
          }
          return response.json(); // レスポンスをJSONとして解析
        })
        .then(jsonData => {
          // const responseData = jsonData.json(); // サーバーからのレスポンスをJSONとして解析
          setResponseMessage(jsonData.message || 'データが正常に送信されました。');
        })
        .catch(error => {
          setError(error); // エラーをstateに保存
          // setLoading(false); // ローディング完了（エラー発生時も）
        });
      // setFormData({ name: '', email: '' }); // フォームをリセット
    } catch (error) {
      setError(error.message);
    }
  }, []); // 空の依存配列で初回レンダリング時のみ実行


  // if (loading) {
  //   return <p>データをロード中です...</p>;
  // }

  if (error) {
    return <p>データの取得に失敗しました: {error.message}</p>;
  }

  // if (data) {
  return (
    <div>
      <h1>取得したデータ</h1>
      <pre>RoomId: {responseMessage}</pre>
    </div>
  );
  // }

  // return null; // まだデータがない場合の初期表示
}

function AskForRoomId() {
  const [roomId, setRoomId] = useState('');
  const handleChange = (event) => {
    setRoomId(event.target.value);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello Mizuki!
        </p>
        <input
          type="text"
          id="roomId"
          value={roomId} // stateとinput要素の値を紐付け
          onChange={handleChange} // 入力値が変更されたときのイベントハンドラー
        />
      </header>
    </div>
  );
}

function App() {
  return AskForRoomId();
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Hello Mizuki!
  //       </p>
  //     </header>
  //   </div>
  // );
}

export default App; 
