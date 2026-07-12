import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import GuaranteeBand from "@/components/GuaranteeBand";
import PageHero from "@/components/PageHero";
import ServiceBenefits from "@/components/ServiceBenefits";
import ServiceIntro from "@/components/ServiceIntro";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/jsonld";
import { getAllServicePages, getServicePage } from "@/lib/services";
import { site } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const pages = await getAllServicePages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getServicePage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      type: "website",
      url: `${site.url}/services/${slug}`,
      title: page.title,
      description: page.description,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getServicePage(slug);
  if (!page) notFound();

  const url = `${site.url}/services/${slug}`;

  return (
    <>
      <PageHero
        label={page.h1}
        title={page.h1}
        sub={page.heroSub}
      />

      <ServiceIntro />

      <GuaranteeBand />

      <ServiceBenefits />

      {page.faq && page.faq.length > 0 && (
        <section className="section">
          <div className="wrap" style={{ maxWidth: 740 }}>
            <h2 style={{ marginBottom: 20 }}>Your questions answered</h2>
            <Faq items={page.faq} standalone={false} />
          </div>
        </section>
      )}

      <Contact />

      <JsonLd data={serviceSchema({ name: page.h1, description: page.description, slug })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Services", url: `${site.url}/services` },
          { name: page.h1, url },
        ])}
      />
      {page.faq && page.faq.length > 0 && <JsonLd data={faqSchema(page.faq)} />}
    </>
  );
}
