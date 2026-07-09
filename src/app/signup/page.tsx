import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SignupForm } from "@/components/account/SignupForm";

export const metadata: Metadata = { title: "新規登録" };

export default function SignupPage() {
  return (
    <Section tone="cream" className="min-h-[70vh]">
      <div className="mx-auto max-w-md">
        <SectionHeading
          eyebrow="Sign up"
          title="新規登録"
          description="アカウントを作成すると、ご予約履歴をマイページから確認できます。"
          align="center"
        />
        <SignupForm />
      </div>
    </Section>
  );
}
