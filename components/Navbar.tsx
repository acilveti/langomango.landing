import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNewsletterModalContext } from 'contexts/newsletter-modal.context';
import { ScrollPositionEffectProps, useScrollPosition } from 'hooks/useScrollPosition';
import { NavItems, SingleNavItem } from 'types';
import { media } from 'utils/media';
import Button from './Button';
import Container from './Container';
import Drawer from './Drawer';
import { HamburgerIcon } from './HamburgerIcon';
import Logo from './Logo2Lines';

const ColorSwitcher = dynamic(() => import('../components/ColorSwitcher'), { ssr: false });

type NavbarProps = { items: NavItems };
type ScrollingDirections = 'up' | 'down' | 'none';
type NavbarContainerProps = { hidden: boolean; transparent: boolean; isOverHero: boolean };

export default function Navbar({ items }: NavbarProps) {
  const router = useRouter();
  const { toggle } = Drawer.useDrawer();
  const [scrollingDirection, setScrollingDirection] = useState<ScrollingDirections>('none');
  const [isOverHero, setIsOverHero] = useState(true);

  let lastScrollY = useRef(0);
  const lastRoute = useRef('');
  const stepSize = useRef(50);

  // Check if navbar is over the hero section
  useEffect(() => {
    const checkIfOverHero = () => {
      const heroSection = document.getElementById('hero-sticky-section');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        
        // If scroll position is less than hero height, we're over the hero
        setIsOverHero(scrollPosition < heroHeight - 100); // Subtract navbar height for smoother transition
      }
    };

    // Run on initial load
    checkIfOverHero();
    
    // Add scroll event listener
    window.addEventListener('scroll', checkIfOverHero);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', checkIfOverHero);
    };
  }, []);

  // Modified scroll position callback to prevent hiding the navbar
  function scrollPositionCallback({ currPos }: ScrollPositionEffectProps) {
    const routerPath = router.asPath;
    const hasRouteChanged = routerPath !== lastRoute.current;

    if (hasRouteChanged) {
      lastRoute.current = routerPath;
      setScrollingDirection('none');
      return;
    }

    // We're always showing the navbar now, so we set scrollingDirection to 'none' or 'up'
    setScrollingDirection('none');
    lastScrollY.current = currPos.y;
  }

  // Use the scrollPosition hook with the modified callback
  useScrollPosition(scrollPositionCallback, [router.asPath], undefined, undefined, 50);

  // We're always showing the navbar, so isNavbarHidden is always false
  const isNavbarHidden = false;
  const isTransparent = true; // We'll control transparency via isOverHero instead

  return (
    <NavbarContainer hidden={isNavbarHidden} transparent={isTransparent} isOverHero={isOverHero}>
      <Content>
        <NextLink href="/" passHref>
          <LogoWrapper isOverHero={isOverHero}>
            <Logo />
          </LogoWrapper>
        </NextLink>
        <NavItemList>
          {items.map((singleItem) => (
            <NavItem key={singleItem.href} {...singleItem} isOverHero={isOverHero} />
          ))}
        </NavItemList>
      </Content>
    </NavbarContainer>
  );
}

function NavItem({ href, title, outlined, onClick, isOverHero }: SingleNavItem & { isOverHero?: boolean }) {
  const { setIsModalOpened } = useNewsletterModalContext();

  function showNewsletterModal() {
    setIsModalOpened(true);
  }

  // Handle the click event
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      // If there's a custom onClick handler provided, use it
      onClick(e);
    }
    // If no onClick handler provided, the default link behavior will occur
  };

  return (
    <NavItemWrapper outlined={outlined} isOverHero={isOverHero}>
      <NextLink href={href} passHref>
        <a data-umami-event="navbar button" onClick={handleClick}>{title}</a>
      </NextLink>
    </NavItemWrapper>
  );
}

const LogoWrapper = styled.a<{ isOverHero?: boolean }>`
  display: flex;
  margin-right: auto;
  text-decoration: none;
  color: ${(p) => (p.isOverHero ? 'white' : 'rgb(var(--logoColor))')};
  transition: color 0.3s ease;
`;

const NavItemList = styled.div`
  display: flex;
  list-style: none;
  margin-left: 1.25em;
`;

const NavItemWrapper = styled.li<Partial<SingleNavItem> & { isOverHero?: boolean }>`
  background-color: ${(p) => (p.outlined ? 'rgb(var(--primary))' : 'transparent')};
  border-radius: 0.5rem;
  font-size: 1.3rem;
  text-transform: uppercase;
  line-height: 2;
  margin-left: 1.25em;
  
  &:hover {
    background-color: ${(p) => (p.outlined ? 'rgb(var(--primary), 0.8)' : 'transparent')};
    transition: background-color 0.2s;
  }

  a {
    display: flex;
    color: ${(p) => (p.isOverHero ? 'white' : (p.outlined ? 'rgb(var(--textSecondary))' : 'rgb(var(--text), 0.75)'))};
    letter-spacing: 0.025em;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    font-weight: 700;
    transition: color 0.3s ease;
  }

  &:not(:last-child) {
    margin-right: 2rem;
  }
`;

const NavbarContainer = styled.div<NavbarContainerProps>`
  display: flex;
  position: fixed; /* Changed from sticky to fixed to ensure it's always visible */
  top: 0;
  left: 0;
  right: 0;
  padding: 2.5rem 0rem 0rem 0rem;
  width: 100%;
  height: 10rem;
  z-index: var(--z-navbar);

  background-color: ${(p) => (p.isOverHero ? 'transparent' : 'rgb(var(--navbarBackground))')};
  box-shadow: ${(p) => (p.isOverHero ? 'none' : '0 1px 2px 0 rgb(0 0 0 / 5%)')};
  visibility: visible; /* Always visible */
  transform: translateY(0) translateZ(0) scale(1); /* Always showing */

  transition-property: background-color, box-shadow;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
`;

const Content = styled(Container)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;