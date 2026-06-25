import * as React from 'react';

function LoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={32}
      height={24}
      viewBox='0 0 32 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <mask
        id='lo-a'
        style={{ maskType: 'luminance' }}
        maskUnits='userSpaceOnUse'
        x={0}
        y={0}
        width={32}
        height={24}
      >
        <path fill='#fff' d='M0 0H32V24H0z' />
      </mask>
      <g mask='url(#lo-a)'>
        {/* Red top stripe */}
        <rect x={0} y={0} width={32} height={6} fill='#CE1126' />
        {/* Blue middle stripe */}
        <rect x={0} y={6} width={32} height={12} fill='#002868' />
        {/* Red bottom stripe */}
        <rect x={0} y={18} width={32} height={6} fill='#CE1126' />
        {/* White circle */}
        <circle cx={16} cy={12} r={4} fill='#FFFFFF' />
      </g>
    </svg>
  );
}

export default LoIcon;
