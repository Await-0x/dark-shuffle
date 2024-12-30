import { Box } from '@mui/material';
import { lazy, Suspense, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import background from "./assets/images/background.png";
import BlockRevealAnimation from './components/animations/blockRevealAnimation.jsx';

const Main = lazy(() => import('./Main.jsx'));

function Loading() {
  return <Box className='bgImage' sx={{ width: '100vw', height: '100vh' }}>
    <Box sx={{ paddingTop: '40vh' }}>
      <BlockRevealAnimation hideText icon />
    </Box>
  </Box>
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LazyLoadImage
      alt={""}
      height={0}
      src={background}
      width={0}
      onLoad={() => setIsLoading(false)}
    />
  }

  return <Suspense fallback={<Loading />}>
    <Main />
  </Suspense>
}

export default App