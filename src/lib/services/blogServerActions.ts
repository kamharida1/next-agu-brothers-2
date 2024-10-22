'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import BlogModel, { Blog } from '../models/BlogModel'
// Define an interface for the form state
interface PostFormState {
    errors: {
        title?: string[],
        content?: string[],
        _form?: string[],
    }
}

export async function deletePost(
    slug: string,
): Promise<PostFormState> {
    let post: Blog | null
    try {
      post = await BlogModel.findOneAndDelete({slug})
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                errors: {
                    _form: [error.message],
                },
            }
        }
        else {
            return {
                errors: {
                    _form: ['Something went wrong'],
                },
            }
        }
    }

   revalidatePath('/admin/blog')
   redirect('/admin/blog')
}