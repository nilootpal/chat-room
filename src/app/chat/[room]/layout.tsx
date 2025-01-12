import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Room",
  description: "This project demonstrates how to build a real-time group chat application using Redis Pub/Sub and Next.js 15. The application leverages Redis for its publish/subscribe messaging capabilities to enable efficient real-time communication.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-slate-900 to-slate-600">
        {children}
    </div>
  );
}
