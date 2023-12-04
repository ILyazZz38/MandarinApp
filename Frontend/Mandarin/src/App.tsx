import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import { Link, Route, Routes, Navigate,useLocation } from "react-router-dom";
import { FC } from 'react';
import './App.css';
import Mandarins from './scenes/Mandarin';
import Lots from './scenes/Lots';
import Bets from './scenes/Bets';
import AddMandarin from './scenes/Mandarin/AddMandarin';
import AddLot from './scenes/Lots/AddLot';
import AddBet from './scenes/Bets/AddBet';
import Login from './scenes/Accounts/login';
import Signup from './scenes/Accounts/signup';
import Userfront from '@userfront/toolkit';

function App() {
  return (
    <div style={{ display: "flex", height: "100%", width: "100%"}}>
      <Sidebar className="app" style={{float: "left" }}>
        <Menu>
          <MenuItem component={<Link to="/mandarins" />}> Мандарины </MenuItem>
          <MenuItem component={<Link to="/lots" />}> Лоты </MenuItem>
          <MenuItem component={<Link to="/bets" />}> Ставки </MenuItem>
          <MenuItem component={<Link to="/account" />}> Войти/Выйти </MenuItem>
        </Menu>
      </Sidebar>
      <main className='content'>
            <Routes>
              <Route path='/mandarins' element={<Mandarins/>} />
              <Route path='/mandarins/add' element={<RequireAdminAuth><CheckTokenAddMandarin/></RequireAdminAuth>} />
              <Route path='/lots' element={<RequireAuth><CheckTokenLots/></RequireAuth>} />
              <Route path='/lots/add' element={<RequireAdminAuth><CheckTokenAddLot/></RequireAdminAuth>} />
              <Route path='/bets' element={<RequireAuth><CheckTokenBets/></RequireAuth>} />
              <Route path='/bets/add' element={<RequireAuth><CheckTokenAddBet/></RequireAuth>} />
              <Route path='/account' element={<RequireReg><CheckTokenAccount/></RequireReg>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/signup' element={<Signup/>} />
            </Routes>
          </main>
    </div>
  );
}

///TODO: Перенести и сделать через одну константу
interface RequireAuthProps {
  children: React.ReactNode;
}

//Проверка авторизации
const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
  let location = useLocation();
  if (!Userfront.tokens.accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

//Проверка на админа
const RequireAdminAuth: FC<RequireAuthProps> = ({ children }) => {
  let location = useLocation();
  if (!Userfront.tokens.accessToken && Userfront.user.hasRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

//Проверка для выхода и входа
const RequireReg: FC<RequireAuthProps> = ({ children }) => {
  let location = useLocation();
  if (!Userfront.tokens.accessToken) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }
  return children;
}

interface DashboardProps {}

//На будущее
const CheckTokenAddMandarin: FC<DashboardProps> = () => {
  const userData = JSON.stringify(Userfront.user, null, 2);
  return (
    <div>
      <AddMandarin/>
    </div>
  );
}

const CheckTokenLots: FC<DashboardProps> = () => {
  const userData = JSON.stringify(Userfront.user, null, 2);
  return (
    <div>
      <Lots/>
    </div>
  );
}

const CheckTokenAddLot: FC<DashboardProps> = () => {
  const userData = JSON.stringify(Userfront.user, null, 2);
  return (
    <div>
      <AddLot/>
    </div>
  );
}

const CheckTokenBets: FC<DashboardProps> = () => {
  const userData = JSON.stringify(Userfront.user, null, 2);
  return (
    <div>
      <Bets/>
    </div>
  );
}

const CheckTokenAddBet: FC<DashboardProps> = () => {
  const userData = JSON.stringify(Userfront.user, null, 2);
  return (
    <div>
      <AddBet/>
    </div>
  );
}

const CheckTokenAccount: FC<DashboardProps> = () => {
  return (
    <div>
      <pre>{Userfront.user.email}</pre>
      <button onClick={() => Userfront.logout()}>Выйти</button>
    </div>
  );
}

export default App;
