function LocationIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d='M14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z'
        stroke='currentColor'
        strokeWidth='1.5'
      />
      <path
        d='M19 8.85714C19 11.1415 17.302 13.9966 15.4424 15.9028C14.2191 17.1567 12.9259 18 12 18C11.0741 18 9.78087 17.1567 8.55756 15.9028C6.69796 13.9966 5 11.1415 5 8.85714C5 5.07005 8.13401 2 12 2C15.866 2 19 5.07005 19 8.85714Z'
        stroke='currentColor'
        strokeWidth='1.5'
      />
      <path
        d='M15.1542 16.1895C18.569 16.6154 21 17.7131 21 19C21 20.6569 16.9706 22 12 22C7.02944 22 3 20.6569 3 19C3 17.7131 5.43101 16.6154 8.84581 16.1895'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
}

export default LocationIcon;
