import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export default function DMCA() {
  return (
    <Layout>
      <PageHero
        title="Copyright & DMCA"
        subtitle="How to report copyright concerns about material on this site"
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="gradient-card border border-border rounded-xl p-6 md:p-9 space-y-7 font-body text-sm leading-relaxed text-muted-foreground">
          <p>
            This page describes how to contact the site about a copyright concern. It is not legal
            advice and does not determine whether a particular use is authorized. Renegade Immortal
            is an unofficial fan site. It contains original reference and sect material, and
            may link to or embed third-party media pages. We do not operate or control those
            external services.
          </p>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">Send a copyright notice</h2>
            <p className="mb-3">
              If you are a rights holder or authorized representative and believe material hosted on
              this site infringes your copyright, send a written notice to the address below. To
              help us identify and review the issue, include:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Identification of the copyrighted work you believe has been infringed.</li>
              <li>
                The exact page URL and a clear description of the material at issue. For third-party
                links or embeds, include the page on this site where the link appears.
              </li>
              <li>Your name and contact details, including a working email address.</li>
              <li>
                A statement that you have a good-faith belief the disputed use is not authorized by
                the rights holder, its agent, or the law.
              </li>
              <li>
                A statement that the information in your notice is accurate and, under penalty of
                perjury, that you are the rights holder or authorized to act for the holder.
              </li>
              <li>Your physical or electronic signature.</li>
            </ul>
            <p className="mt-3">
              Do not send passwords, payment information, or unrelated personal documents. A notice
              may be shared with the person who submitted the material when needed to address the
              claim.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">Review and counter-notices</h2>
            <p>
              We review complete reports and may remove or restrict access to material while a
              claim is reviewed. If your material was removed and you believe this was a mistake,
              reply to the notice or contact us with the relevant page, an explanation, and your
              contact information. Where applicable, a formal counter-notice may require additional
              statements and consent under the law. Consider getting independent legal advice
              before submitting one.
            </p>
          </section>

          <section className="rounded-lg border border-primary/20 bg-primary/5 p-5">
            <h2 className="font-heading text-lg text-foreground mb-2">Copyright contact</h2>
            <p className="mb-3">
              Email copyright reports and related questions to:
            </p>
            <a
              href="mailto:mail.jkyme@gmail.com?subject=Copyright%20notice"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Mail size={16} />
              mail.jkyme@gmail.com
            </a>
            <p className="mt-3 text-xs">
              For information about personal data submitted with a request, see the{" "}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </section>
        </article>
      </div>
    </Layout>
  );
}
