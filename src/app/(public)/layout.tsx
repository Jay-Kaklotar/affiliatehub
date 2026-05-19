import { Navbar, Footer } from "@/components/layout";
import { Suspense } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Navbar />
      </Suspense>
      <main>{children}</main>
      <Footer />
    </>
  );
}
