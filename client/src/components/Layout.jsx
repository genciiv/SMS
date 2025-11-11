import { Link } from "react-router-dom";

export default function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">G-coode</div>
        <nav className="menu">
          <Link to="/">🏠 Kryefaqja</Link>
          <Link to="/attendance">📝 Prezenca</Link>
          <Link to="/assignments">📚 Detyrat</Link>
          <Link to="/grades">🎯 Notat</Link>
        </nav>
        <div className="userbox">
          <div className="userbox__name">{user.firstName} {user.lastName}</div>
          <div className="userbox__role">{user.role}</div>
          <button className="btn btn--ghost" onClick={logout}>Dil</button>
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
