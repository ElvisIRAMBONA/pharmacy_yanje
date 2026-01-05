import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminNavigation = ({ navLinks }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <ul className="admin-nav">
      {navLinks.map((link, index) => (
        <li key={index} className={link.dropdown ? 'dropdown' : ''}>
          {link.dropdown ? (
            <>
              <span 
                className="dropdown-toggle"
                onClick={() => handleDropdownToggle(index)}
              >
                {link.label} ▼
              </span>
              {openDropdown === index && (
                <ul className="dropdown-menu">
                  {link.dropdown.map((subLink, subIndex) => (
                    <li key={subIndex}>
                      <Link 
                        to={subLink.path}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {subLink.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <Link to={link.path}>{link.label}</Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default AdminNavigation;