'use server'

// Import the revalidatePath and redirect functions from Next.js
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Import the Zod library for validation
import { z } from 'zod'
import BlogModel, { Blog } from '../models/BlogModel'
import dbConnect from '../dbConnect'

// Define a schema for the post using Zod
const postSchema = z.object({
    // the title must be a string between 3 and 255 characters
    title: z.string().min(3).max(255),
    // the content must be a string between 10 and 4000 characters
    content: z.string().min(10).max(4000),
    // the image must be a string
    image: z.string(),
})

// Define an interface for the form state
interface PostFormState {
    errors: {
        title?: string[],
        content?: string[],
        _form?: string[],
    }
}

// Define an asynchronous function to create a post
export async function createPost(
    formState: PostFormState,
    formData: FormData
): Promise<PostFormState> {
    // Validate the form data against the post schema
    // If the form data does not match the schema, the safeParse method returns an object 
    // with a success property of false and an error property containing the validation errors. 
    // If the form data matches the schema, the safeParse method returns an object 
    // with a success property of true and a data property containing the validated data. 
    const result = postSchema.safeParse({
      title: formData.get('title'),
      content: formData.get('content'),
      image: formData.get('image'),
    })

    // If validation fails, return the errors
    if (!result.success) {
        return {
            // The flatten method is used to convert the validation errors into a flat object structure 
            // that can be easily displayed in the form.
            errors: result.error.flatten().fieldErrors
        }
    }

  let post: Blog
  await dbConnect()
    try {
        // If validation passes, create a new post in the database
      post = await BlogModel.create({
        title: result.data.title,
        content: result.data.content,
        image: result.data.image,
      })
    } catch (error: unknown) {
        // If there's an error, return it
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

    // Revalidate the path and redirect to the home page
    revalidatePath('/admin/blog')
    redirect('/admin/blog') 
}

export async function updatePost(
    id: string,
    formState: PostFormState,
    formData: FormData
): Promise<PostFormState> {
    const result = postSchema.safeParse({
      title: formData.get('title'),
      content: formData.get('content'),
      image: formData.get('image'),
    })

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    let post: Blog | null
    try {
      post = await BlogModel.findByIdAndUpdate(id, {
        title: result.data.title,
        content: result.data.content,
        image: result.data.image,
      }, {
        new: true
      })
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