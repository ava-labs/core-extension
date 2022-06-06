import { useTheme } from 'styled-components';

export function CircularText({ text }: { text: string }) {
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
