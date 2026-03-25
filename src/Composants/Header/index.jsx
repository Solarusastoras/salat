import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Moon, BookOpen, Clock, GraduationCap } from 'lucide-react';
import './header.scss';

const Header = () => {
  return (
    <header className="header glass-panel">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <Moon className="header__logo-icon" size={28} />
          <span>Noor</span>
        </Link>

        <nav className="header__nav">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <NavLink
                to="/salat"
                className={({ isActive }) => isActive ? "header__nav-link active" : "header__nav-link"}
              >
                <Clock size={20} />
                <span>Salat</span>
              </NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink
                to="/coran"
                className={({ isActive }) => isActive ? "header__nav-link active" : "header__nav-link"}
              >
                <BookOpen size={20} />
                <span>Coran</span>
              </NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink
                to="/apprendre"
                className={({ isActive }) => isActive ? "header__nav-link active" : "header__nav-link"}
              >
                <GraduationCap size={20} />
                <span>Apprendre</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
