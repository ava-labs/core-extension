import { VerticalFlex } from '@avalabs/react-components';
import { useTheme } from 'styled-components';

function CircularText({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <svg height="90" width="90" viewBox="25 25 150 150">
      <defs>
        <path
          id="circle"
          d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
        />
      </defs>
      <text fill={theme.colors.bg1} fontSize="10" fontFamily="Inter">
        <textPath href="#circle">{`${text.trim()} `.repeat(20)}</textPath>
      </text>
    </svg>
  );
}

export function QRCodeLogo({
  text,
  size = 91,
  className,
}: {
  text: string;
  size: number;
  className?: string;
}) {
  const theme = useTheme();
  return (
    <VerticalFlex
      className={className}
      position="relative"
      radius="50%"
      background={theme.colors.icon1}
      width={`${size}px`}
      height={`${size}px`}
      padding="4px"
      align="center"
      justify="center"
    >
      <svg
        style={{ position: 'absolute' }}
        width={Math.floor(size * 0.6)}
        height={Math.floor(size * 0.6)}
        viewBox="0 0 41 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="20.6962"
          cy="20.3499"
          rx="20.165"
          ry="20.1887"
          fill={theme.colors.bg1}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.87308 29.4948H14.6036C15.4431 29.4948 15.8629 29.4948 16.241 29.3822C16.6525 29.2597 17.029 29.041 17.3395 28.7443C17.6247 28.4718 17.8329 28.1072 18.2493 27.3779L24.4428 16.5303C24.8531 15.8115 25.0584 15.4521 25.1484 15.073C25.2463 14.6605 25.2462 14.2306 25.1478 13.8181C25.0575 13.4391 24.852 13.0799 24.441 12.3616L24.441 12.3615L22.0522 8.18595C21.4871 7.19801 21.2045 6.70403 20.8456 6.52054C20.4579 6.32226 19.9984 6.3226 19.611 6.52144C19.2524 6.70547 18.9705 7.19985 18.4068 8.18861L8.04959 26.3547L8.04938 26.355C7.49386 27.3294 7.2161 27.8166 7.23857 28.2162C7.26285 28.648 7.49182 29.0423 7.85479 29.2773C8.19066 29.4948 8.75146 29.4948 9.87308 29.4948ZM25.9965 29.494H31.481C32.6145 29.494 33.1812 29.494 33.5182 29.2744C33.8824 29.037 34.1106 28.6392 34.1317 28.205C34.1512 27.8032 33.8653 27.3137 33.2936 26.3347L30.5468 21.6324L30.5466 21.6321C29.983 20.6671 29.7011 20.1845 29.3448 20.0041C28.9597 19.8092 28.5048 19.8095 28.1199 20.005C27.7639 20.1859 27.4827 20.669 26.9203 21.6349L24.1826 26.3374C23.6129 27.3157 23.3282 27.8049 23.3481 28.2065C23.3696 28.6403 23.5979 29.0376 23.962 29.2746C24.2988 29.494 24.8648 29.494 25.9965 29.494Z"
          fill={theme.colors.icon1}
        />
      </svg>
      <CircularText text={text} />
    </VerticalFlex>
  );
}
