import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu';

function Layout() {
  return (
    <div className="app-shell">
      <Menu />
      <div className="app-main">
        <Header />
        <main className="app-content"><Outlet /></main>
      </div>
    </div>
  );
}

export default Layout;
