"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center text-foreground">
      <h1 className="text-2xl font-bold">حدث خطأ في تحميل الصفحة</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        جرّب تحديث الصفحة. إذا استمرت المشكلة، أوقف السيرفر، احذف مجلد{" "}
        <code className="text-primary">.next</code>، ثم شغّل{" "}
        <code className="text-primary">npm run dev</code> من جديد.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          إعادة المحاولة
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">الرئيسية</Link>
        </Button>
      </div>
    </div>
  );
}
