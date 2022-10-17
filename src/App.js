import './App.css';
import './components/Header/Header'
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import { useDispatch } from 'react-redux';
import * as actions from './store/actions';

function App() {

  const dispatcher = useDispatch();

  const onPressed = () => {
    dispatcher(actions.changeDrawingState(true));
  }
  
  const onNotPressed = () => {
    dispatcher(actions.changeDrawingState(false));
  }
  
  return (
    <div className="App" onMouseLeave={onNotPressed} onMouseDown={onPressed} onMouseUp={onNotPressed} >
      <Header />
      <Main />
    </div>
  );
}

export default App;
