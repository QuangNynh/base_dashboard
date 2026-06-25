import * as React from 'react';

function AgendaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M8 9h4m-4 4h8m-8 4h8m0-15v3M8 2v3M7 3.5h10a4 4 0 014 4V18a4 4 0 01-4 4H7a4 4 0 01-4-4V7.5a4 4 0 014-4z'
        stroke='#8F9294'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default AgendaIcon;
