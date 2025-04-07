
import { useEffect } from 'react';

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  useEffect(() => {
    // Update the document title when the component mounts or title changes
    document.title = title;
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Magnetic';
    };
  }, [title]);

  // This component doesn't render anything visible
  return null;
};

export default PageTitle;
