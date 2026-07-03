import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Clock, GraduationCap } from 'lucide-react';
import './footer.scss';

const Footer = () => {
  return (
    <footer className="footer glass-panel">
      <nav className="footer__nav">
        <ul className="footer__nav-list">
          <li className="footer__nav-item">
            <NavLink
              to="/salat"
              className={({ isActive }) => isActive ? "footer__nav-link active" : "footer__nav-link"}
            >
              <Clock size={24} />
              <span>Salat</span>
            </NavLink>
          </li>
          <li className="footer__nav-item">
            <NavLink
              to="/coran"
              className={({ isActive }) => isActive ? "footer__nav-link active" : "footer__nav-link"}
            >
              <BookOpen size={24} />
              <span>Coran</span>
            </NavLink>
          </li>
          <li className="footer__nav-item">
            <NavLink
              to="/apprendre"
              className={({ isActive }) => isActive ? "footer__nav-link active" : "footer__nav-link"}
            >
              <GraduationCap size={24} />
              <span>Apprendre</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
