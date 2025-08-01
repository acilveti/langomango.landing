import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ScrollPositionEffectProps, useScrollPosition } from 'hooks/useScrollPosition';
import { NavItems, SingleNavItem } from 'types';
import Container from './Container';
import ExpandingButton from './ExpandingButton';
import Logo from './Logo2Lines';

type NavbarProps = { items: NavItems };
type ScrollingDirections = 'up' | 'down' | 'none';
type NavbarContainerProps = { hidden: boolean; transparent: boolean; isOverHero: boolean; isDarkened: boolean };

export default function Navbar({ items }: NavbarProps) {
  const router = useRouter();
  const [setScrollingDirection] = useState<ScrollingDirections>('none');
  const [isOverHero, setIsOverHero] = useState(true);
  const [isDarkened, setIsDarkened] = useState(false);

  let lastScrollY = useRef(0);
  const lastRoute = useRef('');

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

  // Check for darkening effect (same logic as in Homepage)
  useEffect(() => {
    // Only apply darkening logic on homepage
    if (router.pathname !== '/') return;

    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (!heroSection) {
        console.warn('[Navbar] hero-section not found');
        return;
      }
      
      // Look for the reader demo container by multiple methods
      let widgetContainers = heroSection.querySelectorAll('.reader-demo-container');
      let widget: Element | null = null;
      
      if (widgetContainers.length === 0) {
        // Try data attributes on DemoContainer
        widgetContainers = heroSection.querySelectorAll('[data-demo-container="true"]');
      }
      
      if (widgetContainers.length === 0) {
        // Try ReaderDemoWidget data attributes
        widgetContainers = heroSection.querySelectorAll('[data-reader-widget="true"], [data-reader-wrapper="true"]');
      }
      
      if (widgetContainers.length === 0) {
        // Fallback to class name search for backwards compatibility
        widgetContainers = heroSection.querySelectorAll('[class*="DemoContainer"], [class*="ReaderWrapper"], [class*="ReaderContainer"]');
      }
      
      if (widgetContainers.length > 0) {
        widget = widgetContainers[0];
      } else {
        // Try one more time with a more specific search
        const allDivs = heroSection.getElementsByTagName('div');
        for (let i = 0; i < allDivs.length; i++) {
          const className = allDivs[i].className;
          if (typeof className === 'string' && 
              (className.includes('Demo') || className.includes('Reader') || className.includes('Widget'))) {
            widget = allDivs[i];
            break;
          }
        }
      }
      
      if (!widget) {
        console.warn('[Navbar] No reader widget containers found');
        return;
      }
      const rect = widget.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenterY = rect.top + rect.height / 2;
      const screenCenterY = windowHeight / 2;
      
      const distanceFromCenter = Math.abs(elementCenterY - screenCenterY);
      const maxDistance = windowHeight / 2;
      const darkness = Math.max(0, 1 - (distanceFromCenter / maxDistance));
      const smoothDarkness = Math.pow(darkness, 2);
      
      // Set darkened state if darkness is above threshold
      setIsDarkened(smoothDarkness > 0.3); // Trigger animation when effect is moderately active
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [router.pathname]);

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
    <NavbarContainer hidden={isNavbarHidden} transparent={isTransparent} isOverHero={isOverHero} isDarkened={isDarkened}>
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

function NavItem({ title, outlined, onClick, isOverHero }: SingleNavItem & { isOverHero?: boolean }) {

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
      <ExpandingButton style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} data-umami-event="cta button" onClick={handleClick}>
        <p data-umami-event="navbar button">
          {title}
        </p>
      </ExpandingButton>
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
    color: ${(p) => (p.isOverHero ? 'white' : p.outlined ? 'rgb(var(--textSecondary))' : 'rgb(var(--text), 0.75)')};
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 2.5rem 0rem 0rem 0rem;
  width: 100%;
  height: 10rem;
  z-index: var(--z-navbar);

  background-color: ${(p) => (p.isOverHero ? 'transparent' : 'rgb(var(--navbarBackground))')};
  box-shadow: ${(p) => (p.isOverHero ? 'none' : '0 1px 2px 0 rgb(0 0 0 / 5%)')};
  visibility: ${(p) => (p.isDarkened ? 'hidden' : 'visible')};
  transform: ${(p) => p.isDarkened ? 'translateY(-100%) translateZ(0)' : 'translateY(0) translateZ(0)'};
  opacity: ${(p) => (p.isDarkened ? 0 : 1)};

  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
              visibility 0.8s,
              background-color 0.3s ease-in-out,
              box-shadow 0.3s ease-in-out;
`;

const Content = styled(Container)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
