import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LoginForm } from "@/components/account/LoginForm";

export const metadata: Metadata = { title: "ログイン" };

export default function LoginPage() {
  return (
    <Section tone="cream" className="min-h-[70vh]">
      <div className="mx-auto max-w-md">
        <SectionHeading eyebrow="Login" title="ログイン" align="center" />
        <LoginForm />
      </div>
    </Section>
  );
}
