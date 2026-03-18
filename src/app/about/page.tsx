import { AboutClient } from '@/components/about/AboutClient';
import { createClient } from '@/lib/supabase/server';

export default async function AboutUsPage() {
   const supabase = await createClient();

   // Fetch site content for about page
   const { data: siteContent } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', 'about');

   // Helper to find specific section content
   const getContent = (section: string) => siteContent?.find(c => c.section === section)?.content || {};

   return (
      <AboutClient 
         content={{
            hero: getContent('hero'),
            mission: getContent('mission'),
            vision: getContent('vision')
         }}
      />
   );
}
