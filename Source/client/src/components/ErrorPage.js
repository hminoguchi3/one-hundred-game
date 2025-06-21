import '../App.css';

function ErrorPage({ errorMessage }) {
  return (
    <div>
      <p>データの取得に失敗しました: {errorMessage}</p>
    </div>
  );
}

export default ErrorPage; 
