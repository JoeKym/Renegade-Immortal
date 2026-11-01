import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { ReleaseTimeline } from "@/components/donghua/ReleaseTimeline";

export default function DonghuaReleaseTimelinePage() {
  return (
    <Layout>
      <PageHero
        title="Donghua Release Timeline"
        subtitle="Current release schedules and episode progress for every tracked donghua"
      />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <ReleaseTimeline />
        </div>
      </section>
    </Layout>
  );
}
