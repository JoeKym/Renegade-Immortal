import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { trackSearch } from "@/services/searchTracking";

interface SearchableLinkProps {
  to: string;
  children: React.ReactNode;
  itemTitle: string;
  category: string;
  queryContext?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * A link component that tracks when users click on searchable items.
 * Use this for links to characters, artifacts, locations, etc. to track popularity.
 */
export function SearchableLink({
  to,
  children,
  itemTitle,
  category,
  queryContext = "direct_navigation",
  className,
  onClick,
}: SearchableLinkProps) {
  const navigate = useNavigate();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Track the click
      trackSearch({
        query: queryContext,
        category,
        resultTitle: itemTitle,
        resultPath: to,
        action: "click",
        searchType: "page",
      });

      // Call any additional onClick handler
      onClick?.();

      // Navigate
      if (!e.defaultPrevented) {
        e.preventDefault();
        navigate(to);
      }
    },
    [navigate, onClick, to, itemTitle, category, queryContext]
  );

  return (
    <Link to={to} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

interface TrackableButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  itemTitle: string;
  category: string;
  queryContext?: string;
  className?: string;
}

/**
 * A button component that tracks when users click on items.
 * Use this for buttons that open or navigate to searchable content.
 */
export function TrackableButton({
  onClick,
  children,
  itemTitle,
  category,
  queryContext = "direct_interaction",
  className,
}: TrackableButtonProps) {
  const handleClick = useCallback(() => {
    // Track the click
    trackSearch({
      query: queryContext,
      category,
      resultTitle: itemTitle,
      action: "click",
      searchType: "page",
    });

    // Call the original onClick
    onClick?.();
  }, [onClick, itemTitle, category, queryContext]);

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
