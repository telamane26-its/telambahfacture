"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditInvoiceRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.id as string;

  useEffect(() => {
    if (invoiceId) {
      router.replace(`/invoices/new?edit=${invoiceId}`);
    }
  }, [invoiceId, router]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0F1117] flex items-center justify-center text-xs text-slate-400">
      Redirection vers le formulaire d&apos;édition...
    </div>
  );
}
