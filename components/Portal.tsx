import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  id?: string;
}

export default function Portal({ children, id = 'portal-root' }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Create portal root if it doesn't exist
    let portalRoot = document.getElementById(id);
    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.setAttribute('id', id);
      document.body.appendChild(portalRoot);
    }

    return () => {
      // Clean up only if no other portals are using this root
      const portalRoot = document.getElementById(id);
      if (portalRoot && portalRoot.childNodes.length === 0) {
        document.body.removeChild(portalRoot);
      }
    };
  }, [id]);

  if (!mounted) return null;

  const portalRoot = document.getElementById(id);
  if (!portalRoot) return null;

  return createPortal(children, portalRoot);
}
