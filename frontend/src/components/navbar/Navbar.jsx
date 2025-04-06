import { debounce } from "lodash";
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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navDropdownRef = useRef(null);

  console.log("re-render in navbar");

  /*==========================Side effect==================================*/
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Thêm ngưỡng trễ (threshold) để tránh chuyển đổi liên tục
      if (scrollTop > 50 && !isScrolled) {
        setIsScrolled(true);
      } else if (scrollTop <= 50 && isScrolled) {
        setIsScrolled(false);
      }
    };
  
    // Thêm debounce
    const debouncedHandleScroll = debounce(handleScroll, 2);
    window.addEventListener('scroll', debouncedHandleScroll);
    
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [isScrolled]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target)) { 
        setActiveDropdown(null);
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
    if (searchValue.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchValue)}`;
    }
  };

  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  const handleLoginClick = useCallback(() => {
    setIsLoginOpen(true);
  }, []);

  const toggleNavDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

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
                      <Link to="/profile" className="dropdown-link">
                        <User size={16} />
                        <span>My Profile</span>
                      </Link>
                    </li>
                    <li className="dropdown-item">
                      <a href="/favorites" className="dropdown-link">
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
          <div className="navbar__bottom" ref={navDropdownRef}>
            <ul className="nav-list">

              <li className={`nav-item nav-dropdown ${activeDropdown === "meals" ? "active" : ""}`}>
                <div className="nav-dropdown-trigger" onClick={() => toggleNavDropdown("meals")}>
                  <Link to="#" onClick={(e) => e.preventDefault()}>
                    MEALS
                  </Link>
                  <ChevronDown size={14} className="dropdown-icon" />
                </div>
                {activeDropdown === "meals" && (
                  <div className="nav-dropdown-content">
                    <Link to="/breakfast" className="nav-dropdown-item">
                      Breakfast & Brunch
                    </Link>
                    <Link to="/lunch" className="nav-dropdown-item">
                      Lunch
                    </Link>
                    <Link to="/healthy" className="nav-dropdown-item">
                      Healthy
                    </Link>
                    <Link to="/appetizers" className="nav-dropdown-item">
                      Appetizers & Snacks
                    </Link>
                    <Link to="/salads" className="nav-dropdown-item">
                      Salads
                    </Link>
                    <Link to="/side-dishes" className="nav-dropdown-item">
                      Side Dishes
                    </Link>
                    <Link to="/soups" className="nav-dropdown-item">
                      Soups
                    </Link>
                    <Link to="/bread" className="nav-dropdown-item">
                      Bread
                    </Link>
                    <Link to="/drinks" className="nav-dropdown-item">
                      Drinks
                    </Link>
                    <Link to="/desserts" className="nav-dropdown-item">
                      Desserts
                    </Link>
                    <Link to="/all-meals" className="nav-dropdown-item view-all">
                      VIEW ALL
                    </Link>
                  </div>
                )}
              </li>

              <li className={`nav-item nav-dropdown ${activeDropdown === "ingredients" ? "active" : ""}`}>
                <div className="nav-dropdown-trigger" onClick={() => toggleNavDropdown("ingredients")}>
                  <Link to="#" onClick={(e) => e.preventDefault()}>
                    INGREDIENTS
                  </Link>
                  <ChevronDown size={14} className="dropdown-icon" />
                </div>
                {activeDropdown === "ingredients" && (
                  <div className="nav-dropdown-content">
                    <Link to="/chicken" className="nav-dropdown-item">
                      Chicken
                    </Link>
                    <Link to="/beef" className="nav-dropdown-item">
                      Beef
                    </Link>
                    <Link to="/pork" className="nav-dropdown-item">
                      Pork
                    </Link>
                    <Link to="/seafood" className="nav-dropdown-item">
                      Seafood
                    </Link>
                    <Link to="/vegetables" className="nav-dropdown-item">
                      Vegetables
                    </Link>
                    <Link to="/fruits" className="nav-dropdown-item">
                      Fruits
                    </Link>
                    <Link to="/all-ingredients" className="nav-dropdown-item view-all">
                      VIEW ALL
                    </Link>
                  </div>
                )}
              </li>
              
              <li className={`nav-item nav-dropdown ${activeDropdown === "occasions" ? "active" : ""}`}>
                <div className="nav-dropdown-trigger" onClick={() => toggleNavDropdown("occasions")}>
                  <Link to="#" onClick={(e) => e.preventDefault()}>
                    OCCASIONS
                  </Link>
                  <ChevronDown size={14} className="dropdown-icon" />
                </div>
                {activeDropdown === "occasions" && (
                  <div className="nav-dropdown-content">
                    <Link to="/holidays" className="nav-dropdown-item">
                      Holidays
                    </Link>
                    <Link to="/birthdays" className="nav-dropdown-item">
                      Birthdays
                    </Link>
                    <Link to="/dinner-parties" className="nav-dropdown-item">
                      Dinner Parties
                    </Link>
                    <Link to="/all-occasions" className="nav-dropdown-item view-all">
                      VIEW ALL
                    </Link>
                  </div>
                )}
              </li>

              <li className={`nav-item nav-dropdown ${activeDropdown === "cuisines" ? "active" : ""}`}>
                <div className="nav-dropdown-trigger" onClick={() => toggleNavDropdown("cuisines")}>
                  <Link to="#" onClick={(e) => e.preventDefault()}>
                    CUISINES
                  </Link>
                  <ChevronDown size={14} className="dropdown-icon" />
                </div>
                {activeDropdown === "cuisines" && (
                  <div className="nav-dropdown-content">
                    <Link to="/italian" className="nav-dropdown-item">
                      Italian
                    </Link>
                    <Link to="/mexican" className="nav-dropdown-item">
                      Mexican
                    </Link>
                    <Link to="/asian" className="nav-dropdown-item">
                      Asian
                    </Link>
                    <Link to="/american" className="nav-dropdown-item">
                      American
                    </Link>
                    <Link to="/all-cuisines" className="nav-dropdown-item view-all">
                      VIEW ALL
                    </Link>
                  </div>
                )}
              </li>

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