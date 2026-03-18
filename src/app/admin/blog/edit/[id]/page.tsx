import { createClient } from '@/lib/supabase/server';
import NewPostClient from '@/components/admin/blog/NewPostClient';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('cms_posts')
    .select('*, post_tags(*)')
    .eq('id', params.id)
    .single();

  if (!post) notFound();

  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name');

  const { data: tags } = await supabase
    .from('blog_tags')
    .select('*')
    .order('name');

  return (
    <div className="p-8">
      <NewPostClient 
        categories={categories || []} 
        tags={tags || []} 
        post={post}
      />
    </div>
  );
}
