import { redirect } from "next/navigation";

// /contact now redirects to the strategy session flow
export default function ContactPage() {
  redirect("/strategy-session");
}
