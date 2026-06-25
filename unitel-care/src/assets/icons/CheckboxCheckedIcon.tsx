import * as React from 'react';

function CheckboxCheckedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0 3C0 1.34315 1.34315 0 3 0H13C14.6569 0 16 1.34315 16 3V13C16 14.6569 14.6569 16 13 16H3C1.34315 16 0 14.6569 0 13V3Z'
        fill='#FF5100'
      />
      <path
        d='M5.47621 9.85033L3.91656 8.33772C3.47866 7.91302 2.76783 7.91302 2.32993 8.33772C2.11697 8.54425 2 8.81768 2 9.10857C2 9.39945 2.11697 9.67289 2.32993 9.87651L4.68139 12.1571C5.11929 12.5818 5.83013 12.5818 6.26803 12.1571L13.4514 5.19032C13.6643 4.98379 13.7813 4.71036 13.7813 4.42238C13.7813 4.13149 13.6643 3.85806 13.4514 3.65153C13.0135 3.22683 12.3027 3.22683 11.8648 3.65153L5.47621 9.85033Z'
        fill='white'
      />
    </svg>
  );
}

export default CheckboxCheckedIcon;
