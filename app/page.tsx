import { I18nProvider } from "@/lib/i18n";
import { WorldProvider } from "@/lib/world";
import { Portfolio } from "@/components/Portfolio";
export default function Home() {
  return (
    <I18nProvider>
      <WorldProvider>
        <Portfolio />
      </WorldProvider>
    </I18nProvider>
  );
}
