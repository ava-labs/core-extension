import { SVGProps } from 'react';
const AddIcon = (props: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    width={props.size ?? 19}
    height={props.size ?? 19}
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.3333 10.6667H10.6667V17.3333C10.6667 18.0667 10.0667 18.6667 9.33333 18.6667C8.6 18.6667 8 18.0667 8 17.3333V10.6667H1.33333C0.6 10.6667 0 10.0667 0 9.33333C0 8.6 0.6 8 1.33333 8H8V1.33333C8 0.6 8.6 0 9.33333 0C10.0667 0 10.6667 0.6 10.6667 1.33333V8H17.3333C18.0667 8 18.6667 8.6 18.6667 9.33333C18.6667 10.0667 18.0667 10.6667 17.3333 10.6667Z"
      fill="currentColor"
    />
  </svg>
);
export default AddIcon;
