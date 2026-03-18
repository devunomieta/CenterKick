import { createClient } from '@/lib/supabase/server';
import NewPostClient from '@/components/admin/blog/NewPostClient';

export default async function NewPostPage() {
  const supabase = await createClient();

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
      />
    </div>
  );
}
