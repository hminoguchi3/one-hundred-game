import logo from '../kishi.png';
import '../App.css';

function WebPageTemplate({ contents }) {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Hello Mizuki!
                </p>
            </header>
            <main className="App-main">
                {contents}
            </main>
        </div >
    );
}

export default WebPageTemplate; 
