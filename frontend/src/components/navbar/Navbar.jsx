import { Bookmark, ChevronDown, HelpCircle, LogOut, Menu, Plus, Search, User, UserCircle } from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo_large from '../../assets/icons/logo_large.svg';
import logo_small from '../../assets/icons/logo_small.svg';
import Login from "../../pages/authen/Login";
import SignUp from "../../pages/authen/SignUp";
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const accountDropdownRef = useRef(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  /*==========================Side effect==================================*/
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      console.log(scrollTop);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /*==========================Handle event==================================*/
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchValue);
    // Implement search functionality here
  };

  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  const handleLoginClick = useCallback(() => {
    setIsLoginOpen(true);
  }, []);

  /*==========================Component==================================*/
  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <div className="navbar__top">
          <div className='navbar__menu-logo-wrapper'>
            {isScrolled && (
            <button className="navbar__menu-button">
                <Menu size={24} />
            </button>
            )}
            <div className="navbar__logo">
                <a href="/">
                    <img 
                        src={isScrolled ? logo_small : logo_large} 
                        alt="Allrecipes" 
                        className={isScrolled ? "navbar__logo-small" : "navbar__logo-large"} 
                    />
                </a>
            </div>
          </div>

          <div className="navbar__search">
            <form onSubmit={handleSearchSubmit}>
              <div className="search__container">
                <input 
                  type="text" 
                  placeholder="Find a recipe or ingredient" 
                  value={searchValue}
                  onChange={handleSearchChange}
                />
                <button type="submit" className="search-button">
                  <Search size={20} />
                </button>
              </div>
            </form>
          </div>

          {isLoggedIn ? (
            <div className="navbar__account" ref={accountDropdownRef}>
              <button className="account-button" onClick={toggleAccountDropdown}>
                <div className="account-icon">
                  <img src="https://via.placeholder.com/30" alt="User" />
                </div>
                <span className="account-text">My Account</span>
                <ChevronDown size={16} />
              </button>
              
              {isAccountOpen && (
                <div className="account-dropdown">
                  <ul className="dropdown-menu">
                    <li className="dropdown-item">
                      <a href="/logout" className="dropdown-link">
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </a>
                    </li>
                    <li className="dropdown-item">
                      <a href="/profile" className="dropdown-link">
                        <User size={16} />
                        <span>My Profile</span>
                      </a>
                    </li>
                    <li className="dropdown-item">
                      <a href="#save-recipes" className="dropdown-link">
                        <Bookmark size={16} />
                        <span>Saved Recipes & Collections</span>
                      </a>
                    </li>
                    <li className="dropdown-divider"></li>
                    <li className="dropdown-item">
                      <a href="/recipeform" className="dropdown-link">
                        <Plus size={16} />
                        <span>Add a Recipe</span>
                      </a>
                    </li>
                    <li className="dropdown-item">
                      <a href="/help" className="dropdown-link">
                        <HelpCircle size={16} />
                        <span>Help</span>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button className='navbar__login' onClick={handleLoginClick}>
              <UserCircle color="#D64B1A" size={30} />
              <p>Log In</p>
            </button> 
          )}
        </div>
        
        {!isScrolled && ( 
          <div className="navbar__bottom">
            <ul className="nav-list">
              <li className="nav-item"><Link to="/recipes">EXPLORE</Link></li>
              <li className="nav-item"><Link to="/contribute">CONTRIBUTE</Link></li>
              <li className="nav-item"><Link to="/community">COMMUNITY</Link></li>
              <li className="nav-item"><Link to="#">OCCASIONS</Link></li>
              <li className="nav-item"><Link to="#">CUISINES</Link></li>
              <li className="nav-item"><Link to="#">KITCHEN TIPS</Link></li>
              <li className="nav-item"><Link to="#">NEWS</Link></li>
              <li className="nav-item"><Link to="#">FEATURES</Link></li>
              <li className="nav-item"><Link to="#">ABOUT US</Link></li>
            </ul>
          </div>
        )}
      </div>

      {isLoginOpen && (
          <Login
            onClose={() => setIsLoginOpen(false)}
            onSwitch={() => {
              setIsLoginOpen(false);
              setIsSignUpOpen(true);
            }}
          />
        )}

      {isSignUpOpen && (
        <SignUp
          onClose={() => setIsSignUpOpen(false)}
          onSwitch={() => {
            setIsSignUpOpen(false);
            setIsLoginOpen(true);
          }}
        />
      )}
    </header>
  );
};

export default memo(Navbar);