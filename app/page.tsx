import EmailSender from "@/components/EmailSender";
import LeftDesign from "@/components/LeftDesign";

export default function Home() {
  return (
    <main className="flex">
      <LeftDesign />
      <EmailSender />
    </main>
  );
}
