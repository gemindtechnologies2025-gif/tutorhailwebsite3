import { useState } from "react";

 export const TruncatedText = ({ text, maxWords = 100, className = "" }:any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (!text) return null;
    
    const words = text.split(' ');
    const needsTruncation = words.length > maxWords;
    
    const displayText = isExpanded || !needsTruncation 
      ? text 
      : words.slice(0, maxWords).join(' ') + '...';
    
    return (
      <div className={className}>
        <div dangerouslySetInnerHTML={{ __html: displayText }} />
        {needsTruncation && (
          <button 
            className="show-more-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              color: '#4CAF50',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginTop: '8px',
              fontWeight: 'bold'
            }}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  };

  // Component to truncate list items with show more/less functionality
export const TruncatedList = ({ items, maxItems = 3, className = "" }:any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!items || !items.length) return null;
  
  const needsTruncation = items.length > maxItems;
  const displayItems = isExpanded || !needsTruncation 
    ? items 
    : items.slice(0, maxItems);
  
  return (
    <div className={className}>
      <ul className="rw_top">
        {displayItems?.map((item:any, index:number) => (
          <li key={index}>{item?.name}</li>
        ))}
      </ul>
      {needsTruncation && (
        <button 
          className="show-more-btn" 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            color: '#4CAF50',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginTop: '8px',
            fontWeight: 'bold'
          }}
        >
          {isExpanded ? 'Show less' : `Show all (${items.length})`}
        </button>
      )}
    </div>
  );
};