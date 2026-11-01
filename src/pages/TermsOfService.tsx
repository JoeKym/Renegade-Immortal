import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const updated = "November 1, 2026";

export default function TermsOfService() {
  return (
    <Layout>
      <PageHero title="Terms of Service" subtitle={`Last updated: ${updated}`} />

      <div className="py-12 px-4">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto gradient-card border border-border rounded-xl p-6 md:p-9 space-y-7 font-body text-foreground/85 text-sm leading-relaxed"
        >
          <p className="text-muted-foreground">
            These terms describe the basic rules for using this fan-made information and community
            site. They are a plain-language summary, not legal advice. If you do not agree, please
            discontinue use of the site.
          </p>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">1. Site and third-party material</h2>
            <p>
              Renegade Immortal is an unofficial fan project with reference material, a donghua
              release tracker, links or embeds to third-party media pages, and community features.
              The site is not affiliated with or endorsed by Er Gen, publishers, animation studios,
              distributors, or streaming providers. Their names, works, and marks remain theirs.
              We do not control third-party services, their availability, or their content; use
              those services under their own terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">2. Accounts and access</h2>
            <p>
              Keep your sign-in details secure, provide accurate information where requested, and
              tell us if you suspect unauthorized use of your account. You are responsible for
              activity carried out through your account. We may limit or suspend access when
              reasonably necessary to protect users, the service, or its operation.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">3. Community rules</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Do not use the site to violate laws or another person’s rights.</li>
              <li>Do not harass, threaten, impersonate, or target other users.</li>
              <li>Do not post spam, malware, deceptive links, or abusive material.</li>
              <li>Do not attempt to disrupt, probe, or gain unauthorized access to the site.</li>
              <li>Only upload or share material you are permitted to use.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">4. User contributions</h2>
            <p>
              You remain responsible for material you submit. By posting or uploading it, you
              confirm that you have the rights needed to share it and allow the site to host,
              display, and distribute it as necessary to provide the feature you chose. Do not
              submit private information about someone else without permission. We may hide or
              remove content and restrict accounts to enforce these terms or respond to a report.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">5. Copyright requests</h2>
            <p>
              If you believe material on the site infringes your rights, please follow the
              instructions on our <Link to="/dmca" className="text-primary hover:underline">copyright and DMCA page</Link>.
              We review complete requests and may remove or restrict access to material while
              reviewing a claim.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">6. Availability and information</h2>
            <p>
              Site content, episode counts, schedules, and links are provided for general
              informational and fan-community purposes. Schedules and external sources can change
              without notice, and we cannot guarantee uninterrupted access, accuracy, or
              availability. The site is provided on an “as available” basis to the extent permitted
              by applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">7. Changes and contact</h2>
            <p>
              We may revise these terms as features or operations change. The latest version and
              effective date will be posted here. Continued use after an update means you have had
              an opportunity to review the revised terms. Questions can be sent through the{" "}
              <Link to="/contact" className="text-primary hover:underline">contact page</Link>.
            </p>
          </section>
        </motion.article>
      </div>
    </Layout>
  );
}
