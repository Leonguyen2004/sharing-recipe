import React from "react";
import { Link } from "react-router-dom";
import './Footer.scss';

const Footer = () => {
    const menuItems = [
        {name: "HOME", path: "/"},
        {name: "RECIPES", path: "/recipes"},
        // {name: "KITCHEN WISDOM", path: "/Kitchen_wisdom"},
        {name: "CONTRIBUTE", path: "/contribute"},
        {name: "COMMUNITY", path: "/community"}
    ];

    return (
        <div className="footer">
            <div className="top">
                <div className="footer__logo">
                    <img src="/resource/icons/Logo-footer.svg" alt="logo" className="footer__logo-image"/>
                    <span className="footer__logo-title">
                        <span>LET</span>
                        <span>COOK</span>
                    </span>
                </div>

                <ul className="footer__menu">
                    {menuItems.map(({ name, path }) => (
                        <li
                            key={name}
                            className='footer__item'
                        >
                            <Link to={path} className="footer__link">
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="footer__icons">
                    <img src="/resource/icons/ic_baseline-tiktok.svg" alt="logo" className="icon"/>
                    <img src="/resource/icons/icon-face.svg" alt="logo" className="icon"/>
                    <img src="/resource/icons/icon-yt.svg" alt="logo" className="icon"/>
                    <img src="/resource/icons/icon-instar.svg" alt="logo" className="icon"/>
                </div>
            </div>

            <p className="bottom">
                Copyright: © 2024 Cooks Delight.
            </p>
        </div>
    );
}

export default Footer;