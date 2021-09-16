import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login'
import Dashboard from './Dashboard'

//codeだったらdashboardそれ以外はloginをレンダリング
//https://qiita.com/ovrmrw/items/1c1564481c4ca9cc4351
const code = new URLSearchParams(window.location.search).get('code')
console.log(code);
function App() {
  console.log(code);
  return code ? <Dashboard  code={code}/> : <Login/> 
}
export default App;
