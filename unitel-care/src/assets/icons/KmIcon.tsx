import * as React from 'react';

function KmIcon(props: React.SVGProps<SVGSVGElement>) {
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
        id='km-a'
        style={{ maskType: 'luminance' }}
        maskUnits='userSpaceOnUse'
        x={0}
        y={0}
        width={32}
        height={24}
      >
        <path fill='#fff' d='M0 0H32V24H0z' />
      </mask>
      <g mask='url(#km-a)'>
        {/* Blue top stripe */}
        <rect x={0} y={0} width={32} height={6} fill='#032EA1' />
        {/* Red middle stripe */}
        <rect x={0} y={6} width={32} height={12} fill='#E00025' />
        {/* Blue bottom stripe */}
        <rect x={0} y={18} width={32} height={6} fill='#032EA1' />
        {/* Angkor Wat simplified silhouette */}
        <g fill='#FFFFFF'>
          {/* Center tower */}
          <rect x={14.5} y={8} width={3} height={7} />
          <polygon points='16,7 14,9 18,9' />
          {/* Left tower */}
          <rect x={10} y={10} width={2} height={5} />
          <polygon points='11,9 9.5,10.5 12.5,10.5' />
          {/* Right tower */}
          <rect x={20} y={10} width={2} height={5} />
          <polygon points='21,9 19.5,10.5 22.5,10.5' />
          {/* Base platform */}
          <rect x={8} y={14} width={16} height={1.5} />
          <rect x={10} y={15.5} width={12} height={1} />
        </g>
      </g>
    </svg>
  );
}

export default KmIcon;
