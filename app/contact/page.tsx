import { redirect } from "next/navigation";

// /contact now redirects to home — the contact form lives at /#contact
export default function ContactPage() {
  redirect("/");
}
