// pages/404.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { logPageVisit } from 'services/logServices';

const Custom404 = () => {
  const router = useRouter();

  useEffect(() => {
    const logNotFoundVisit = async () => {
      try {
        // Capture the attempted URL using router.asPath
        const attemptedRoute = router.asPath;

        await logPageVisit(attemptedRoute);

      } catch (error) {
        console.error('Error logging 404 visit:', error);
      }

      // Redirect to the homepage after the API call
      router.push('/');
    };

    logNotFoundVisit();
  }, [router]);

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Redirecting to the homepage...</p>
    </div>
  );
};

export default Custom404;
