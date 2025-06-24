import '../App.css';
import { Button } from "./util.js"

function EnterRoomInputForm({ onClose }) {
    return (
        <div className="App-form" style={{ width: "60%" }}>
            遊び方<br />
            友達と決めた「部屋のあいことば」を入力してスタート！<br />
            お題を決めて入力しよう！（例：人気のスイーツ）<br /><br />
            あなたに「1〜100」の数字がランダムで配られるよ。<br />
            「1」に近い数字ほど、お題にあまり当てはまらないものを、<br />
            「100」に近い数字ほど、とても当てはまるものを考えて入力しよう！<br /><br />
            「自分の数字が小さい」と思う人から順番にカードを出してね！
            <Button onClick={onClose}>閉じる</Button>
        </div>
    );
}

export default EnterRoomInputForm; 
