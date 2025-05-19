// Updated YoutubeVideo.tsx with Reddit Pixel tracking
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
// Import Reddit Pixel tracking
import { trackRedditConversion, RedditEventTypes } from 'utils/redditPixel';

import playIcon from '../public/play-icon.svg';

interface YoutubeVideoProps {
  title?: string;
  url: string;
  onPlay?: () => void; // Optional callback for external tracking
}

export default function YoutubeVideo(props: YoutubeVideoProps) {
  const { title, url, onPlay } = props;
  const videoHash = extractVideoHashFromUrl(url);
  const hasTrackedImpression = useRef(false);
  
  // Track video impression when component mounts
  useEffect(() => {
    if (!hasTrackedImpression.current) {
      trackRedditConversion(RedditEventTypes.VIEW_CONTENT, {
        content_type: 'video',
        content_id: videoHash,
        title: title || 'Video Tutorial',
        engagement_type: 'impression'
      });
      hasTrackedImpression.current = true;
    }
  }, [videoHash, title]);
  
  // Create click handler that tracks play event
  const handleVideoClick = () => {
    // Track video play with Reddit Pixel
    trackRedditConversion(RedditEventTypes.VIEW_CONTENT, {
      content_type: 'video',
      content_id: videoHash,
      title: title || 'Video Tutorial',
      engagement_type: 'play'
    });
    
    // Call external tracking handler if provided
    if (onPlay) {
      onPlay();
    }
  };
  
  const srcDoc = `<style>
  * {
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
  
  html,
  body {
    height: 100%
  }
  
  img,
  span {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .thumbnail {
    object-fit: cover;
  }
  
  .play {
    display: flex;
    justify-content: center;
    display: block;
    height: 10vw;
    width: 100%;
  }
  </style>
  <a style="color: rgb(var(--primary))" href=https://www.youtube.com/embed/${videoHash}?autoplay=1 id="youtube-link">
    <img class="thumbnail" src="https://img.youtube.com/vi/${videoHash}/hqdefault.jpg" alt='${title || ''}'>
    <img class="play" src="${playIcon}" alt="Play the video">
  </a>
  <script>
    document.getElementById('youtube-link').addEventListener('click', function() {
      window.parent.postMessage('video-clicked', '*');
    });
  </script>`;
  
  // Set up message listener for iframe click
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'video-clicked') {
        handleVideoClick();
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  return (
    <VideoContainer>
      <VideoFrame
        className=""
        width="100%"
        height="100%"
        src=""
        srcDoc={srcDoc}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
        loading="lazy"
        onLoad={() => {
          // Track video loaded as visible
          if (typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver(
              (entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    trackRedditConversion(RedditEventTypes.SECTION_VISIBLE, {
                      section_name: 'Video Player',
                      content_id: videoHash,
                      visibility_percent: Math.round(entry.intersectionRatio * 100)
                    });
                    observer.disconnect();
                  }
                });
              },
              { threshold: 0.5 }
            );
            
            observer.observe(document.querySelector('.video-container') as Element);
          }
        }}
      />
    </VideoContainer>
  );
}

function extractVideoHashFromUrl(url: string) {
  try {
    const videoHashQueryParamKey = 'v';
    const searchParams = new URL(url).search;
    const hash = new URLSearchParams(searchParams).get(videoHashQueryParamKey);
    return hash || '';
  } catch (error) {
    console.error('Error extracting video hash:', error);
    return '';
  }
}

export const VideoContainer = styled.div`
  display: flex;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  class-name: video-container;

  &:before {
    display: block;
    content: '';
    width: 100%;
    padding-top: 56.25%;
  }
`;

const VideoFrame = styled.iframe`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;