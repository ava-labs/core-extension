// prettier-ignore

export const WalletClosedIcon = ({
  size = 16,
  color = 'currentColor',
}: {
  size: number;
  color: string;
}) => {
  return <svg width={`${size}px`} height={`${size}px`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<rect width="16" height="16" fill="none"/>
	<path d="M2.66675 6.66687C2.66675 5.5623 3.56218 4.66687 4.66675 4.66687H11.3334C12.438 4.66687 13.3334 5.5623 13.3334 6.66687V10.6669C13.3334 11.7714 12.438 12.6669 11.3334 12.6669H4.66675C3.56218 12.6669 2.66675 11.7714 2.66675 10.6669V6.66687Z" stroke={color} strokeWidth="1.2"/>
	<path d="M13.3334 6.66687H10.6667C9.56218 6.66687 8.66675 7.5623 8.66675 8.66687C8.66675 9.77144 9.56218 10.6669 10.6667 10.6669H13.3334" stroke={color} strokeWidth="1.2"/>
	<rect x="10" y="8" width="1.33333" height="1.33333" rx="0.666667" fill={color}/>
	</svg>
}
