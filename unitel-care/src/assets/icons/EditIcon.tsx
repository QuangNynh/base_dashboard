import * as React from 'react';

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d='M3 21h18M13.784 5.312s0 1.634 1.635 3.269c1.635 1.635 3.27 1.635 3.27 1.635m-11.37 7.772l3.433-.49c.495-.071.954-.3 1.308-.654l8.263-8.263a2.312 2.312 0 000-3.27l-1.635-1.634a2.312 2.312 0 00-3.269 0L7.156 11.94a2.311 2.311 0 00-.654 1.308l-.49 3.432a1.156 1.156 0 001.308 1.308z'
        stroke='#8F9294'
        strokeWidth={1.5}
        strokeLinecap='round'
      />
    </svg>
  );
}

export default EditIcon;
