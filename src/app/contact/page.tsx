import { ContactClient } from '@/components/contact/ContactClient';
import { createClient } from '@/lib/supabase/server';
import { getCachedData } from '@/lib/redis';
import { getGlobalCMSData } from '@/lib/cms';

export default async function ContactPage() {
   const supabase = await createClient();
   const { navContent, footerContent, siteSettings } = await getGlobalCMSData();

   // Fetch layout from cache
   const layout = await getCachedData('contact_layout', async () => {
      const { data: pageData } = await supabase
         .from('site_pages')
         .select('*')
         .eq('slug', '/contact')
         .single();
      return pageData?.layout || ["header", "info", "form", "faqs"];
   }, 3600);

   // Fetch all site content for this page from cache
   const siteContent = await getCachedData('contact_site_content', async () => {
      const { data } = await supabase
         .from('site_content')
         .select('*')
         .eq('page', '/contact');
      return Object.fromEntries(data?.map(c => [c.section, c.content]) || []);
   }, 1800);

   return (
      <ContactClient 
         layout={layout}
         content={siteContent}
         navContent={navContent}
         footerContent={footerContent}
         siteSettings={siteSettings}
      />
   );
}
