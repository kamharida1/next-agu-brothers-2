import { auth } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  const body = (await req.json()) as { paramsToSign: Record<string, string> };
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(paramsToSign,'raOnuH6_f9FpgQZs4NgFKTdzLzc');

  return Response.json({ signature });
}) as any