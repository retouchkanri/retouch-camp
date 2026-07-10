import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { LINE_URL } from "@/lib/nav";

export const metadata: Metadata = { title: "LINE友だち追加" };

const STEPS = [
  "スマートフォンでLINEアプリを開く",
  "ホーム画面右上の「友だち追加」→「QRコード」を選択",
  "上のQRコードを読み取る",
];

export default function LinePage() {
  return (
    <Section tone="cream" className="min-h-[70vh]">
      <div className="mx-auto flex max-w-md flex-col gap-8">
        <SectionHeading
          eyebrow="LINE"
          title="LINEで友だち追加"
          description="Retouch Horse Gardenの公式LINEアカウントです。空き状況のお知らせやご予約のご相談を、LINEから気軽にお送りいただけます。"
          align="center"
        />

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <ImagePlaceholder
            label="LINE友だち追加QRコード"
            description="LINE公式アカウント管理画面（LINE Official Account Manager）からダウンロードした友だち追加用QRコード画像をここに配置してください。"
            aspect="square"
          />

          {LINE_URL && (
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[#06C755] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#05A94A]"
            >
              スマートフォンの方はこちら（友だち追加）
            </a>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-base font-semibold text-forest-dark">読み取り方法</h2>
          <ol className="mt-3 space-y-2 text-sm text-charcoal-soft">
            {STEPS.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#06C755]/10 text-xs font-semibold text-[#06C755]">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
