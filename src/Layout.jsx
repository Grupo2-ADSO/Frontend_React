import Menu from './components/Menu';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';


function Layout() {
    return (
        <div className="app">
            <Menu />

            <div className="contenido">
                <Header />

                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;