import { createClient } from '@/lib/supabase/server';
import PageEditorClient from '@/components/admin/cms/PageEditorClient';
import { notFound } from 'next/navigation';

export default async function PageEditorPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug: encodedSlug } = await params;
  const slug = decodeURIComponent(encodedSlug);
  
  const supabase = await createClient();
  
  // Fetch Page Layout
  const { data: page } = await supabase
    .from('site_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!page) return notFound();

  // Fetch Page Content
  const { data: content } = await supabase
    .from('site_content')
    .select('*')
    .eq('page', slug);

  // Fetch Categories for dropdowns
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('id, name')
    .order('name');

  return (
    <PageEditorClient 
      page={page} 
      content={content || []} 
      categories={categories || []} 
    />
  );
}
