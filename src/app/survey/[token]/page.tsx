import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SurveyForm } from "@/components/sections/SurveyForm";
import { getSurveyByToken } from "@/lib/survey";

export const metadata: Metadata = { title: "滞在後アンケート" };

export default async function SurveyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const survey = await getSurveyByToken(token);

  if (!survey) notFound();

  return (
    <Section tone="cream" className="min-h-[70vh]">
      <div className="mx-auto max-w-xl">
        <SectionHeading
          eyebrow="Survey"
          title="ご滞在アンケート"
          description={`${survey.booking?.customer_name} 様、この度はご宿泊いただきありがとうございました。今後の施設づくりの参考にさせていただきますので、ぜひご協力ください。`}
        />
        {survey.responded_at ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-serif text-lg font-semibold text-forest-dark">
              ご回答済みです
            </p>
            <p className="mt-2 text-sm text-charcoal-soft">
              すでにこちらのアンケートにはご回答いただいております。ありがとうございました。
            </p>
          </div>
        ) : (
          <SurveyForm token={token} />
        )}
      </div>
    </Section>
  );
}
