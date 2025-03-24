import React from 'react';
import { ChevronRight } from 'lucide-react';
import './Breadcrumb.css';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="bccom-breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.url}>{item.label}</a>
            {index < items.length - 1 && (
              <ChevronRight size={16} className="bccom-breadcrumb-separator" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;