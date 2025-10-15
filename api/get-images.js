import { v2 as cloudinary } from 'cloudinary';
import { configDotenv } from "dotenv";
configDotenv();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function getImages(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all images from 'shop-products' folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'shop-products/',
      max_results: 100,
    });

    const images = result.resources.map(resource => ({
      url: resource.secure_url,
      publicId: resource.public_id,
      createdAt: resource.created_at,
    }));

    res.status(200).json({ success: true, images });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
}