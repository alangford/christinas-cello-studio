import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { nav } from "../content/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="wordmark">
          Christina&rsquo;s Cello Studio
        </Link>
        <button
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav id="site-nav" className="site-nav" data-open={open} aria-label="Main">
          <ul className="site-nav__list">
            {nav.map(({ path, label }) => (
              <li key={path}>
                <NavLink to={path} end className="site-nav__link">
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
