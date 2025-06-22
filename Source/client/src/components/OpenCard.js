import '../App.css';
import { Button } from "./util.js"

function getCorrectness(correct, card) {
  // Card is undefined, meaning the card has not opened yet.
  if (!card) {
    return <span style={{ color: 'gray' }}>??</span>
  }
  if (correct) {
    return <span style={{ color: 'green' }}>{card}</span>
  }
  return <span style={{ color: 'red' }}>{card}</span>
}

function OpenCard({ responses, number, openedCard, onClick }) {
  return (
    <div className="App-wrapper">
      <div className="App-card">
        {number}
      </div>
      <div className="App-form">
        <ul>
          {responses.map((obj, index) => (
            <li key={index}>{obj.userId}さんの回答：{obj.response}  {getCorrectness(obj.correct, obj.card)}</li>
          ))}
        </ul>
        {!openedCard && (
          <>
            <Button onClick={onClick}>カードを出す</Button>
          </>
        )}
      </div>
    </div>
  );
}

export default OpenCard; 
