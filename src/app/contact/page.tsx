import { ContactClient } from '@/components/contact/ContactClient';
import { createClient } from '@/lib/supabase/server';
import { getGlobalCMSData } from '@/app/admin/manage-ui/actions';

export default async function ContactPage() {
   const supabase = await createClient();
   const { navContent, footerContent } = await getGlobalCMSData();

   // Fetch layout
   const { data: pageData } = await supabase
      .from('site_pages')
      .select('*')
      .eq('slug', '/contact')
      .single();

   const layout = pageData?.layout || ["header", "info", "form", "faqs"];

   // Fetch all site content for this page
   const { data: siteContentData } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', '/contact');

   const siteContent = Object.fromEntries(siteContentData?.map(c => [c.section, c.content]) || []);

   return (
      <ContactClient 
         layout={layout}
         content={siteContent}
         navContent={navContent}
         footerContent={footerContent}
      />
   );
}
