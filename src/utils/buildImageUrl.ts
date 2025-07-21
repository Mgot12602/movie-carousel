import { ImageSizes } from "@/types/movie";

function buildImageUrl(imagePath: string | null, imageSize: ImageSizes) {
  try {
    const baseUrl = process.env.IMAGES_API_BASE_URL;
    if (!baseUrl) {
      console.error("IMAGES_API_BASE_URL environment variable is not set");
    }
    const path = imageSize + imagePath;
    return new URL(path, baseUrl).toString();
  } catch (error) {
    console.error("Error building image URL:", error);
    return "";
  }
}

export default buildImageUrl;
