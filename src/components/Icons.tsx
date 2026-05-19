interface IconProps {
  className?: string;
}

export const Icons = {
  HomeOffice: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 9.5L12 4L21 9.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 7L12 4.5L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="10" y="15" width="4" height="2" rx="1" fill="currentColor" fillOpacity="0.3"/>
    </svg>
  ),
  Tech: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 20H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Kitchen: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 7H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 17H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="9.5" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="14.5" r="1.5" fill="currentColor"/>
      <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
    </svg>
  ),
  Grooming: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2L4.5 20.29C4.21 21 4.7 21.75 5.43 21.75H18.57C19.3 21.75 19.79 21 19.5 20.29L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 11V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6L11 8H13L12 6Z" fill="currentColor"/>
      <circle cx="12" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  Search: ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Trending: ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m22 7-8.5 8.5-5-5L2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  Amazon: ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M15.93 17.01c-2.68 1.89-6.28 2.45-9.58 1.96-4.47-.6-8.27-3.23-8.85-6.91-.06-.37.22-.56.54-.38 3.11 1.73 7.7 2.45 11.53 1.58.34-.08.5-.36.33-.58-1.45-1.93-6.13-3.21-9.82-1.41-.4.2-.66-.18-.4-.44 2.82-2.81 7.28-3.14 11.2-1.47.86.37 2.13 1.01 2.13 2.1 0 .89-.65 1.62-1.4 1.55-.7-.07-1.39-.41-1.94-1-.19-.2-.45-.19-.5.04l-.18 1.96c-.03.3.17.43.47.36 1.31-.32 2.49-.07 3.59.71.28.2.5.05.44-.24-.46-2.1-2.54-4.44-5.39-3.64l.11-.1c-.41.29-.81.6-1.2.93-.16.14-.24.38-.11.54.22.29.62.51.97.48.36-.02.72-.24.96-.51.12-.13.31-.13.43 0l2.39 2.49c.32.33.18.94-.3 1.03z" />
    </svg>
  ),
  Meesho: ({ className }: IconProps) => (
    <div className={`w-full h-full bg-pink-500 text-white flex items-center justify-center font-black text-[10px] ${className}`}>M</div>
  ),
  Flipkart: ({ className }: IconProps) => (
    <div className={`w-full h-full bg-blue-500 text-white flex items-center justify-center font-black text-[10px] ${className}`}>F</div>
  ),
  Heart: ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  Star: ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 1.7l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.31L12 1.7z" />
    </svg>
  ),
  Blog: ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
};
