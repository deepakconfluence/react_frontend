import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';

/**
 * Renders assistant markdown. Internal links (starting with "/") navigate via the
 * router instead of triggering a full page reload.
 */
export function MarkdownContent({ content }: { content: string }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-2 text-sm leading-relaxed [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-primary [&_a]:underline">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const isInternal = href?.startsWith('/');
            return (
              <a
                href={href}
                {...props}
                onClick={(e) => {
                  if (isInternal && href) {
                    e.preventDefault();
                    navigate(href);
                  }
                }}
                target={isInternal ? undefined : '_blank'}
                rel={isInternal ? undefined : 'noopener noreferrer'}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
