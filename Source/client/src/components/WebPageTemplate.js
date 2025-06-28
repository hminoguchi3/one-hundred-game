import kishi from '../kishi.png';
import harmit from '../harmit.png';
import '../App.css';

function WebPageTemplate({ contents }) {
    return (
        <div className="App">
            <header className="App-header">
                <img src={kishi} className="App-logo" alt="logo" />
                <p>
                    Hello Mizuki!
                </p>
                <img src={harmit} className="App-logo" alt="logo" />
            </header>
            <main className="App-main">
                {contents}
            </main>
        </div >
    );
}

export default WebPageTemplate; 
