import { Instagram, Twitter, Github, Linkedin, Facebook } from 'lucide-react';
import './SocialLinks.css';

const SocialLinks = ({ socialLinks }) => {
  const { instagram, twitter, github, linkedin, facebook } = socialLinks || {};
  
  return (
    <div className="social-links">
      {instagram && (
        <a href={instagram} target="_blank" rel="noopener noreferrer" className="social-link">
          <span className="social-name">Instagram</span>
        </a>
      )}
      
      {twitter && (
        <a href={twitter} target="_blank" rel="noopener noreferrer" className="social-link">
          <span className="social-name">Twitter</span>
        </a>
      )}
      
      {facebook && (
        <a href={facebook} target="_blank" rel="noopener noreferrer" className="social-link">
          <span className="social-name">Facebook</span>
        </a>
      )}
    </div>
  );
};

export default SocialLinks;