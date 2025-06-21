export function GetCorrectness(correct, card) {
  // Card is undefined, meaning the card has not opened yet.
  if (!card) {
    return <span style={{ color: 'gray' }}>??</span>
  }
  if (correct) {
    return <span style={{ color: 'green' }}>{card}</span>
  }
  return <span style={{ color: 'red' }}>{card}</span>
}