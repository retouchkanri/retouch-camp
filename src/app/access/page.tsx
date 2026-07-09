import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = { title: "アクセス" };

export default function AccessPage() {
  return (
    <>
      <section className="bg-forest-dark text-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs tracking-[0.2em] text-terracotta uppercase">Access</p>
          <h1 className="max-w-2xl font-serif text-3xl leading-snug font-semibold sm:text-4xl">
            アクセス
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-cream/80 sm:text-base">
            大阪府河内長野市。大阪市内から車で約40分の里山エリアにあります。
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2">
          <ImagePlaceholder
            label="施設周辺地図"
            description="Googleマップの埋め込み、またはアクセスマップ画像。"
            aspect="square"
          />
          <div className="space-y-8">
            <div>
              <SectionHeading title="所在地" />
              <p className="-mt-6 text-sm leading-relaxed text-charcoal-soft">
                〒586-0000
                <br />
                大阪府河内長野市（詳細住所はご予約確定後にご案内します）
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-forest-dark">お車でお越しの方</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                阪和自動車道／南阪奈道路 各ICより約20〜30分。専用駐車場を各サイトに1台分ご用意しています。
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-forest-dark">
                電車・バスでお越しの方
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                南海高野線・近鉄長野線「河内長野駅」よりバスで約20分、下車後徒歩約10分。当日は駅からの送迎について事前にご相談ください。
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-forest-dark">チェックイン／アウト</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                チェックイン 15:00〜18:00 ／ チェックアウト 〜11:00
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <ImagePlaceholder
          label="施設入口・外観"
          description="到着時に目印となる施設入口・看板の写真。"
          aspect="wide"
        />
      </Section>
    </>
  );
}
