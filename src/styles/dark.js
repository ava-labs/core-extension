export default {
  colors: {
    text: '#222725',
    black: '#222725',
    background: '#333',
    primary: '#3d0094',
    secondary: '#7539CB',
    muted: '#f6f6f9',
    gray: '#CBD2D0',
    gray900: '#212121',
    gray500: '#9e9e9e',
    gray300: '#e0e0e0',
    gray200: '#f5f5f5',
    lightGreen500: '#8bc34a',
    lightGreen400: '#7DDF64',
    purple200: '#F8F7FF',
    lightPurple200: '#CFC5E6',
    lightPurple100: '#ECE7F5',
    red600: '#DF3B57', // avalanche red
    red500: '#e84142', // avalanche red
    orange500: '#F5841F', // avalanche red
    white: '#fff',
    highlight: 'hsla(205, 100%, 40%, 0.125)',
  },
  buttons: {
    cursor: 'pointer',
    padding: '8px 24px',
    primary: {
      fontSize: 2,
      fontWeight: '500',
      color: 'secondary',
      bg: 'white',
      borderRadius: '5px',
    },
    outline: {
      variant: 'buttons.primary',
      color: 'primary',
      bg: 'transparent',
      boxShadow: 'inset 0 0 2px',
    },
    secondary: {
      variant: 'buttons.primary',
      color: 'background',
      bg: 'secondary',
    },
  },
};
