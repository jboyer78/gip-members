import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
          {i18n.language === 'fr' ? '🇫🇷' : '🇬🇧'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('fr')}>
          <span className="mr-2">🇫🇷</span> {t('language.fr')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          <span className="mr-2">🇬🇧</span> {t('language.en')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};