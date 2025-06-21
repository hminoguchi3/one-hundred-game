import '../App.css';

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
    <div>
      <ul>
        {responses.map((obj, index) => (
          <li key={index}>{obj.userId}さんの回答：{obj.response}  {getCorrectness(obj.correct, obj.card)}</li>
        ))}
      </ul>
      {!openedCard && (
        <>
          あなたの数字は{number}です<br /><br />
          <button onClick={onClick}>カードを出す</button>
        </>
      )}
    </div>
  );
}

export default OpenCard; 
