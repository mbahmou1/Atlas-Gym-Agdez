import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "خدمة تسيير القاعات",
  description:
    "موقع خاص ونظام إدارة لقاعتك الرياضية: أعضاء، اشتراكات، الأيام المتبقية، مدفوعات، ومتجر مكملات.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
