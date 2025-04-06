import EmailSender from "@/components/EmailSender";
import LeftDesign from "@/components/LeftDesign";

export default function Send() {
  return (
    <main className="flex">
      <LeftDesign />
      <EmailSender />
    </main>
  );
}
