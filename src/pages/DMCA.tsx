import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Mail, Shield } from "lucide-react";

export default function DMCA() {
  return (
    <Layout>
      <PageHero title="DMCA Policy & Takedown Notice" subtitle="Copyright guidelines and takedown requests" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-invert max-w-none font-body text-muted-foreground space-y-6">
          <p>
            We respect the intellectual property rights of others and expect our users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, we will respond expeditiously to claims of copyright infringement committed using our website that are reported to our Designated Copyright Agent, identified below.
          </p>
          
          <h2 className="text-xl font-heading text-foreground mt-8 mb-4">Disclaimer</h2>
          <p>
            This website is a fan-made lore encyclopedia and community platform for the novel and donghua "Renegade Immortal" (Xian Ni) by Er Gen. We do not claim ownership of the original characters, story, universe, or official artwork. All original rights belong to their respective creators and publishers. Content provided on this site is for informational, educational, and community discussion purposes under "Fair Use" principles.
          </p>

          <h2 className="text-xl font-heading text-foreground mt-8 mb-4">Takedown Notice Submission</h2>
          <p>
            If you are a copyright owner, or are authorized to act on behalf of one, or authorized to act under any exclusive right under copyright, please report alleged copyright infringements taking place on or through the site by completing the following DMCA Notice of Alleged Infringement and delivering it to our Designated Copyright Agent.
          </p>

          <div className="p-6 border border-border bg-card/30 rounded-lg my-6">
            <p className="mb-4">Upon receipt of a valid and complete notice, we will take whatever action, in our sole discretion, we deem appropriate, including removal of the challenged material from the site.</p>
            
            <p className="mb-2">Please submit your DMCA Notice containing the following information:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Identify the copyrighted work that you claim has been infringed.</li>
              <li>Identify the material or link you claim is infringing and provide a description of where the material relies.</li>
              <li>Provide your mailing address, telephone number, and email address.</li>
              <li>Include both of the following statements in the body of the Notice:
                <br />- "I hereby state that I have a good faith belief that the disputed use of the copyrighted material is not authorized by the copyright owner, its agent, or the law."
                <br />- "I hereby state that the information in this Notice is accurate and, under penalty of perjury, that I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right under the copyright that is allegedly infringed."
              </li>
              <li>Provide your full legal name and your electronic or physical signature.</li>
            </ul>

            <div className="flex items-center gap-2 mt-6 p-4 bg-primary/10 rounded-md border border-primary/20">
              <Mail className="w-5 h-5 text-primary" />
              <span className="text-foreground">Submit Takedown Notice Email to:</span>
              <a href="mailto:mail.jkyme@gmail.com" className="text-primary hover:underline ml-2">mail.jkyme@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
