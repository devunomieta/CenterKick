import { ContactClient } from '@/components/contact/ContactClient';
import { createClient } from '@/lib/supabase/server';

export default async function ContactPage() {
   const supabase = await createClient();

   // Fetch site content for contact page
   const { data: siteContent } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', 'contact');

   // Helper to find specific section content
   const getContent = (section: string) => siteContent?.find(c => c.section === section)?.content || null;

   const header = getContent('header');
   const faqs = getContent('faqs') as any[];

   return (
      <ContactClient 
         header={header || undefined}
         faqs={faqs || undefined}
      />
   );
}
