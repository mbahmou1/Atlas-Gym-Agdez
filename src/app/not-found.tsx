import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <h1 className="text-2xl font-bold">الصفحة غير موجودة</h1>
      <p className="text-muted-foreground">404</p>
      <Link href="/" className="text-primary underline">
        العودة للرئيسية
      </Link>
    </main>
  );
}
