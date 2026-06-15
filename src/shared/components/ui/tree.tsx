import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface TreeNode {
  id: string;
  label: React.ReactNode;
  children?: TreeNode[];
}

interface TreeProps {
  nodes: TreeNode[];
  className?: string;
  onSelect?: (node: TreeNode) => void;
}

export function Tree({ nodes, className, onSelect }: TreeProps) {
  return (
    <ul className={cn('text-sm', className)} role="tree">
      {nodes.map((node) => (
        <TreeItem key={node.id} node={node} onSelect={onSelect} />
      ))}
    </ul>
  );
}

function TreeItem({ node, onSelect }: { node: TreeNode; onSelect?: (n: TreeNode) => void }) {
  const [open, setOpen] = React.useState(false);
  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <li role="treeitem" aria-expanded={hasChildren ? open : undefined}>
      <div className="flex items-center gap-1 py-1 hover:bg-muted rounded px-1">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="p-0.5 rounded hover:bg-accent"
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            <ChevronRight
              className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-90')}
            />
          </button>
        ) : (
          <span className="w-4" />
        )}
        <button
          type="button"
          onClick={() => onSelect?.(node)}
          className="flex-1 text-left"
        >
          {node.label}
        </button>
      </div>
      {open && hasChildren && (
        <ul className="ml-4 border-l pl-2" role="group">
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  );
}
