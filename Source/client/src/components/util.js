import styled from "styled-components";

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

export const Button = styled.button`
  background-color:rgb(255, 170, 0);
  color: white;
  padding: 5px 30px;
  border-radius: 5px;
  outline: 0;
  border: 0; 
  text-transform: uppercase;
  margin: 2%;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  font-size: calc(5px + 2vmin);
  font-family: "Yusei Magic", sans-serif;
  &:hover {
    background-color: rgb(224, 101, 0);
  }
`;