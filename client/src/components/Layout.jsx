import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const loc = useLocation();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  const NavLink = ({ to, children }) => {
    const active = loc.pathname === to;
    return (
      <Link
        to={to}
        className={`menu__link ${active ? "menu__link--active" : ""}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div style={{ fontWeight: 800, fontSize: 20 }}>G-coode</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>School Management</div>
        </div>

        <nav className="menu">
          <NavLink to="/">🏠 Kryefaqja</NavLink>
          <NavLink to="/attendance">📝 Prezenca</NavLink>
          <NavLink to="/assignments">📚 Detyrat</NavLink>
          <NavLink to="/grades">🎯 Notat</NavLink>
          <NavLink to="/calendar">🗓️ Kalendar</NavLink>
          <NavLink to="/schedule">⌚ Orari</NavLink>
          <NavLink to="/notifications">🔔 Njoftime</NavLink>
        </nav>

        <div className="userbox">
          <div className="userbox__name">
            {(user.firstName || "") + " " + (user.lastName || "")}
          </div>
          <div className="userbox__role">{user.role || "—"}</div>
          <button className="btn btn--ghost" onClick={logout}>Dil</button>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
