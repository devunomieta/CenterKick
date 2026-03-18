import { AboutClient } from '@/components/about/AboutClient';
import { createClient } from '@/lib/supabase/server';
import { getGlobalCMSData } from '@/app/admin/manage-ui/actions';

export default async function AboutUsPage() {
   const supabase = await createClient();
   const { navContent, footerContent } = await getGlobalCMSData();

   // Fetch layout
   const { data: pageData } = await supabase
      .from('site_pages')
      .select('*')
      .eq('slug', '/about')
      .single();

   const layout = pageData?.layout || ["hero", "mission", "vision", "philosophy", "services"];

   // Fetch all site content for this page
   const { data: siteContentData } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', '/about');

   const siteContent = Object.fromEntries(siteContentData?.map(c => [c.section, c.content]) || []);

   return (
      <AboutClient 
         layout={layout}
         content={siteContent}
         navContent={navContent}
         footerContent={footerContent}
      />
   );
}
