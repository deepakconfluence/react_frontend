import { Link } from 'react-router-dom';

export function DefaultBrand() {
  return (
    <Link to="/" className="text-lg font-bold text-primary">
      Confluence Enterprise SaaS
    </Link>
  );
}
