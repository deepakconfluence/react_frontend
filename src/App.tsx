import { Providers } from '@/app/providers';
import { AppRouter } from '@/app/router';
import { useApplyTheme } from '@/shared/hooks/use-apply-theme';

export default function App() {
  useApplyTheme();

  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}
