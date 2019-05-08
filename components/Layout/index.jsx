import Link from 'next/link';
import { logoutUser } from "../../lib/auth";

import './styles.scss';

const Layout = ({ title, children, auth }) => {
  const { user = {} } = auth || {};

  return (
    <main className="root">
      <nav className="navbar">
        <span>Welcome, <strong>{user.username || 'Guest'}</strong></span>
        <div>
          <Link href="/"><a>Home</a></Link>
          {user.email ?
            <React.Fragment>
              <Link href="/profile"><a>Profile</a></Link>
              <button onClick={logoutUser}>Logout</button>
            </React.Fragment> :
            <Link href="/login"><a>Login</a></Link>
          }
        </div>
      </nav>
      <section className="hero">
        <h1>{title}</h1>
        {children}
      </section>
    </main>
  );
};


export default Layout;