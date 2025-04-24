import { debounce } from "lodash";
import { Bookmark, ChevronDown, CircleUser, LogOut, Menu, Plus, Search, ShieldUser, User, UserCircle } from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo_large from '../../assets/icons/logo_large.svg';
import logo_small from '../../assets/icons/logo_small.svg';
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../context/CategoryContext";
import Login from "../../pages/authen/Login";
import SignUp from "../../pages/authen/SignUp";
import { logoutUser } from "../../services/authService";
import { getUserProfile } from "../../services/userService";
import './Navbar.css';

const Navbar = () => {
  /*==========================State==================================*/
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountDropdownRef = useRef(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navDropdownRef = useRef(null);
  const [userData, setUserData] = useState([]);
  const [categoriesByType, setCategoriesByType] = useState({
    meals: [],
    ingredients: [],
    occasions: [],
    cuisines: [],
    cookingMethod: [],
    diet: []
  });
  
  /*==========================Hook==================================*/
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { categories } = useCategories();

  /*==========================Side effect==================================*/
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(currentUser.uid);
        setUserData(userProfile);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserProfile();
  }, [])

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

  useEffect(() => {
    // Phân loại categories theo type
    const categorizeData = () => {
      const types = ['meals', 'ingredients', 'occasions', 'cuisines', 'cookingMethod', 'diet'];
      const categoriesData = {
        meals: [],
        ingredients: [],
        occasions: [],
        cuisines: [],
        cookingMethod: [],
        diet: []
      };

      // Phân loại categories
      categories.forEach(category => {
        const type = category.type;
        if (type && types.includes(type)) {
          categoriesData[type].push(category);
        }
      });

      // Giới hạn tối đa 10 category cho mỗi type
      types.forEach(type => {
        categoriesData[type] = categoriesData[type].slice(0, 10);
      });

      setCategoriesByType(categoriesData);
    };

    categorizeData();
  }, [categories]);

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

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsAccountOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleNavDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  // Thêm hàm xử lý khi click vào category
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
    setActiveDropdown(null);
  };

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
                <a href="/home">
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

          {!!currentUser ? (
            <div className="navbar__account" ref={accountDropdownRef}>
              <button className="account-button" onClick={toggleAccountDropdown}>
                <div className="account-icon">
                  {currentUser? (
                    <img src={userData.photoURL} alt="User" />
                  ) : (
                    <CircleUser size={30} />
                  )}
                </div>
                <span className="account-text">My Account</span>
                <ChevronDown size={16} />
              </button>
              
              {isAccountOpen && (
                <div className="account-dropdown">
                  <ul className="dropdown-menu">
                    <li className="dropdown-item">
                      <a className="dropdown-link" onClick={handleLogout}>
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
                      <a href={`/account/${currentUser.uid}`} className="dropdown-link">
                        <Bookmark size={16} />
                        <span>Saved Recipes & Collections</span>
                      </a>
                    </li>
                    <li className="dropdown-divider"></li>
                    <li className="dropdown-item">
                      <a href="/recipe-form" className="dropdown-link">
                        <Plus size={16} />
                        <span>Add a Recipe</span>
                      </a>
                    </li>
                    <li className="dropdown-item">
                      <a href="/admin" className="dropdown-link">
                        <ShieldUser size={16} />
                        <span>Admin dashboard</span>
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
                    {categoriesByType.meals.map(category => (
                      <div 
                        key={category.id} 
                        className="nav-dropdown-item"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.name}
                      </div>
                    ))}
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
                    {categoriesByType.ingredients.map(category => (
                      <div 
                        key={category.id} 
                        className="nav-dropdown-item"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.name}
                      </div>
                    ))}
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
                    {categoriesByType.occasions.map(category => (
                      <div 
                        key={category.id} 
                        className="nav-dropdown-item"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.name}
                      </div>
                    ))}
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
                    {categoriesByType.cuisines.map(category => (
                      <div 
                        key={category.id} 
                        className="nav-dropdown-item"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.name}
                      </div>
                    ))}
                    <Link to="/all-cuisines" className="nav-dropdown-item view-all">
                      VIEW ALL
                    </Link>
                  </div>
                )}
              </li>

              <li className={`nav-item nav-dropdown ${activeDropdown === "cookingMethod" ? "active" : ""}`}>
                <div className="nav-dropdown-trigger" onClick={() => toggleNavDropdown("cookingMethod")}>
                  <Link to="#" onClick={(e) => e.preventDefault()}>
                    COOKING METHOD
                  </Link>
                  <ChevronDown size={14} className="dropdown-icon" />
                </div>
                {activeDropdown === "cookingMethod" && (
                  <div className="nav-dropdown-content">
                    {categoriesByType.cookingMethod.map(category => (
                      <div 
                        key={category.id} 
                        className="nav-dropdown-item"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.name}
                      </div>
                    ))}
                    <Link to="/all-cooking-methods" className="nav-dropdown-item view-all">
                      VIEW ALL
                    </Link>
                  </div>
                )}
              </li>

              <li className={`nav-item nav-dropdown ${activeDropdown === "diet" ? "active" : ""}`}>
                <div className="nav-dropdown-trigger" onClick={() => toggleNavDropdown("diet")}>
                  <Link to="#" onClick={(e) => e.preventDefault()}>
                    DIET
                  </Link>
                  <ChevronDown size={14} className="dropdown-icon" />
                </div>
                {activeDropdown === "diet" && (
                  <div className="nav-dropdown-content">
                    {categoriesByType.diet.map(category => (
                      <div 
                        key={category.id} 
                        className="nav-dropdown-item"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.name}
                      </div>
                    ))}
                    <Link to="/all-diets" className="nav-dropdown-item view-all">
                      VIEW ALL
                    </Link>
                  </div>
                )}
              </li>

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