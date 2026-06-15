import { useState } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from './i18n';

const LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  tr: 'Türkçe',
};

export function LanguageSwitch() {
  const [locale, setLocale] = useState<SupportedLocale>(DEFAULT_LOCALE);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Change language">
          <Globe className="h-4 w-4 mr-2" />
          {LABELS[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LOCALES.map((l) => (
          <DropdownMenuItem key={l} onSelect={() => setLocale(l)}>
            {LABELS[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
