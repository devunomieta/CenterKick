'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import sharp from 'sharp';

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const cover_image_url = formData.get('cover_image_url') as string;
  const category_id = formData.get('category_id') as string || null;
  const meta_title = formData.get('meta_title') as string;
  const meta_description = formData.get('meta_description') as string;
  const og_image_url = formData.get('og_image_url') as string;
  const is_draft = formData.get('published') !== 'true';
  const tags = JSON.parse(formData.get('tags') as string || '[]');

  const { data: post, error } = await supabase
    .from('cms_posts')
    .insert({
      author_id: user.id,
      title,
      slug,
      type: 'news', // Default to news for blog
      content,
      excerpt,
      cover_image_url,
      category_id,
      meta_title,
      meta_description,
      og_image_url,
      is_draft,
      published_at: !is_draft ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Handle Tags
  if (tags.length > 0) {
    const tagInserts = tags.map((tagId: string) => ({
      post_id: post.id,
      tag_id: tagId
    }));
    await supabase.from('post_tags').insert(tagInserts);
  }

  revalidatePath('/admin/blog');
  revalidatePath('/news');
  revalidatePath('/');
  return { success: true };
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const cover_image_url = formData.get('cover_image_url') as string;
  const category_id = formData.get('category_id') as string || null;
  const meta_title = formData.get('meta_title') as string;
  const meta_description = formData.get('meta_description') as string;
  const og_image_url = formData.get('og_image_url') as string;
  const is_draft = formData.get('published') !== 'true';
  const tags = JSON.parse(formData.get('tags') as string || '[]');

  const { error } = await supabase
    .from('cms_posts')
    .update({
      title,
      slug,
      content,
      excerpt,
      cover_image_url,
      category_id,
      meta_title,
      meta_description,
      og_image_url,
      is_draft,
      published_at: !is_draft ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId);

  if (error) {
    return { error: error.message };
  }

  // Handle Tags - Clear and Re-insert
  await supabase.from('post_tags').delete().eq('post_id', postId);
  if (tags.length > 0) {
    const tagInserts = tags.map((tagId: string) => ({
      post_id: postId,
      tag_id: tagId
    }));
    await supabase.from('post_tags').insert(tagInserts);
  }

  revalidatePath('/admin/blog');
  revalidatePath('/news');
  revalidatePath('/');
  return { success: true };
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

// Category Management
export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const description = formData.get('description') as string;

  const { error } = await supabase
    .from('blog_categories')
    .insert({ name, slug, description });

  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;

  const { error } = await supabase
    .from('blog_categories')
    .update({ name, slug, description, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_categories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

// Tag Management
export async function createTag(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const { error } = await supabase
    .from('blog_tags')
    .insert({ name, slug });

  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function deleteTag(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_tags').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

// Asset Management
export async function createAsset(url: string, filename: string, fileType: string, size: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('blog_assets')
    .insert({ url, filename, file_type: fileType, size_bytes: size });

  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function deleteAsset(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_assets').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/blog');
  return { success: true };
}

export async function uploadBlogImage(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get('file') as File;
  if (!file) return { error: 'No file provided' };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optimize image: Max 1920px width, WebP format, 80% quality
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 80 })
      .toBuffer();

    const fileName = `${Math.random().toString(36).substring(2, 15)}.webp`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, optimizedBuffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) return { error: error.message };

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (err: any) {
    console.error('Image optimization error:', err);
    return { error: 'Failed to process image' };
  }
}
