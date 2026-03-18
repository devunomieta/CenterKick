'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Updates the order of sections for a specific page
 */
export async function updatePageLayout(slug: string, layout: string[]) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('site_pages')
    .update({ layout })
    .eq('slug', slug);

  if (error) {
    console.error('Layout update error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath(slug);
  return { success: true };
}

/**
 * Updates the JSONB content for a specific section on a page
 */
export async function updateSectionContent(page: string, section: string, content: any) {
  const supabase = await createClient();

  // Check if content already exists
  const { data: existing } = await supabase
    .from('site_content')
    .select('id')
    .eq('page', page)
    .eq('section', section)
    .single();

  let res;
  if (existing) {
    res = await supabase
      .from('site_content')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  } else {
    res = await supabase
      .from('site_content')
      .insert({ page, section, content });
  }

  if (res.error) {
    console.error('Content update error:', res.error);
    return { success: false, error: res.error.message };
  }

  revalidatePath('/', 'layout');
  revalidatePath(page === '/' ? '/' : page);
  return { success: true };
}

/**
 * Fetches all manageable pages and their layouts
 */
export async function getManageablePages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_pages')
    .select('*')
    .order('name');

  if (error) return [];
  return data;
}

/**
 * Fetches global CMS data (Navbar, Footer, etc.)
 */
export async function getGlobalCMSData() {
  const supabase = await createClient();
  
  const { data: globalData } = await supabase
    .from('site_content')
    .select('*')
    .in('page', ['navbar', 'footer']);

  const navContent = globalData?.find(c => c.page === 'navbar' && c.section === 'navbar')?.content || null;
  const footerContent = globalData?.find(c => c.page === 'footer' && c.section === 'footer')?.content || null;

  return { navContent, footerContent };
}
/**
 * Seeds initial site pages if they don't exist
 */
export async function seedSitePages() {
  const supabase = await createClient();
  
  const pages = [
    { slug: '/', name: 'Home Page', layout: ["hero", "stories", "news", "highlights", "cta", "testimonials"] },
    { slug: '/about', name: 'About Page', layout: ["hero", "mission", "vision", "philosophy", "services"] },
    { slug: '/contact', name: 'Contact Page', layout: ["header", "info", "form", "faqs"] },
    { slug: '/news', name: 'News Page', layout: ["header", "feed"] },
    { slug: 'navbar', name: 'Global Navbar', layout: ["navbar"] },
    { slug: 'footer', name: 'Global Footer', layout: ["footer"] }
  ];

  for (const page of pages) {
    const { data: existing } = await supabase
      .from('site_pages')
      .select('id')
      .eq('slug', page.slug)
      .single();

    if (!existing) {
      await supabase.from('site_pages').insert(page);
    } else {
      // Update layout to match latest standard if it's a global element
      if (['navbar', 'footer'].includes(page.slug)) {
        await supabase.from('site_pages').update({ layout: page.layout }).eq('slug', page.slug);
      }
    }
  }

  revalidatePath('/admin/manage-ui');
  return { success: true };
}
