import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { getAllSettings } from "@/lib/data";
import { decodeHtmlEntities } from "@/lib/utils";

export default async function SettingsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getAllSettings().catch(() => ({} as Record<string, string>));
  const decoded: Record<string, string> = {};
  for (const [key, value] of Object.entries(settings)) {
    decoded[key] = decodeHtmlEntities(value);
  }
  return <SettingsProvider initialSettings={decoded}>{children}</SettingsProvider>;
}
