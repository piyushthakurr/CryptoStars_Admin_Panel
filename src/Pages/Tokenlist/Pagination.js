import React from 'react';
import { eHandle, range } from '../../services/utils';

const Pagination = ({ tokensPerPage, totalTokens, onPageChange}) => {
  const pageNumbers = [];
  totalTokens = totalTokens > 130 ? totalTokens - 130 : totalTokens;
  console.log('[Pagination]:', tokensPerPage, totalTokens);

  for (let i = 1; i <= Math.ceil(totalTokens / tokensPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        {range(totalTokens).map(num => (
          <li key={num} className='page-item'>
            <a
              href='default(void)'
              className='page-link'
              onClick={e => eHandle(e) && onPageChange(num)} 
            > 
              {num}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;