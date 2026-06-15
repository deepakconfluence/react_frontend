import { PageHeader } from '@/shared/components/feedback/PageHeader';
import { useParams } from 'react-router-dom';

export default function LanguageTextsPage() {
  const { name } = useParams<{ name: string }>();
  return (
    <div className="space-y-4">
      <PageHeader title={`Language texts — ${name ?? ''}`} description="Translate UI strings for this language." />
      <p className="text-muted-foreground">Translation editor — coming soon.</p>
    </div>
  );
}
