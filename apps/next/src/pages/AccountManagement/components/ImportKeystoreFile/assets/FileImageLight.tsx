// The svg includes the file image (32pxX39px) plus 12px margin on each side.

export const FileImageLight = () => {
  return (
    <svg
      width="44"
      height="51"
      viewBox="0 0 44 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2897_24092)">
        <path
          d="M6 6C6 4.34315 7.34315 3 9 3H27L38 14V39C38 40.6569 36.6569 42 35 42H9C7.34315 42 6 40.6569 6 39V6Z"
          fill="url(#paint0_linear_2897_24092)"
        />
        <path
          d="M9 3.5H26.793L37.5 14.207V39C37.5 40.3807 36.3807 41.5 35 41.5H9C7.61929 41.5 6.5 40.3807 6.5 39V6C6.5 4.61929 7.61929 3.5 9 3.5Z"
          stroke="#C8C8CC"
        />
      </g>
      <g filter="url(#filter1_d_2897_24092)">
        <path
          d="M27 14H37L27 4V14Z"
          fill="url(#paint1_linear_2897_24092)"
          shapeRendering="crispEdges"
        />
        <path
          d="M26.8086 3.53809C26.9954 3.4607 27.2105 3.50349 27.3535 3.64648L37.3535 13.6465C37.4965 13.7895 37.5393 14.0046 37.4619 14.1914C37.3845 14.3782 37.2022 14.5 37 14.5H27C26.7239 14.5 26.5 14.2761 26.5 14V4C26.5 3.79779 26.6218 3.61549 26.8086 3.53809Z"
          stroke="#C8C8CC"
          strokeLinejoin="round"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2897_24092"
          x="0"
          y="0"
          width="44"
          height="51"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2897_24092"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2897_24092"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_2897_24092"
          x="19"
          y="0"
          width="22"
          height="22"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-2" dy="2" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2897_24092"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2897_24092"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_2897_24092"
          x1="22"
          y1="3"
          x2="22"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#F4F4F4" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2897_24092"
          x1="32.5"
          y1="9"
          x2="30"
          y2="11.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D8D8D8" stopOpacity="0.6" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
};
