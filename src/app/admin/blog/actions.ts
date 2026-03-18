'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const type = formData.get('type') as any;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const cover_image_url = formData.get('cover_image_url') as string;
  const is_published = formData.get('published') === 'true';

  const { error } = await supabase
    .from('cms_posts')
    .insert({
      author_id: user.id,
      title,
      slug,
      type,
      content,
      excerpt,
      cover_image_url,
      published_at: is_published ? new Date().toISOString() : null,
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/news');
  revalidatePath('/');
  redirect('/admin/blog');
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const type = formData.get('type') as any;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const cover_image_url = formData.get('cover_image_url') as string;
  const is_published = formData.get('published') === 'true';

  const { error } = await supabase
    .from('cms_posts')
    .update({
      title,
      slug,
      type,
      content,
      excerpt,
      cover_image_url,
      published_at: is_published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/news');
  revalidatePath('/');
  redirect('/admin/blog');
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('cms_posts')
    .delete()
    .eq('id', postId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/news');
  revalidatePath('/');
}
