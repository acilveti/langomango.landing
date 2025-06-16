import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  id?: string;
}

export default function Portal({ children, id = 'portal-root' }: PortalProps) {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const portalRoot = document.getElementById(id) || document.body;
    if (!el.current) {
      el.current = document.createElement('div');
    }

    portalRoot.appendChild(el.current);

    return () => {
      if (el.current && portalRoot) {
        portalRoot.removeChild(el.current);
      }
    };
  }, [id]);

  return el.current ? createPortal(children, el.current) : null;
}
