import axios from "axios"

export const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        )

        if (response.data.secure_url) {
            return response.data.secure_url
        } else {
            console.error("Error uploading to Cloudinary", response.data)
            return null
        }
    } catch (error) {
        console.error("Upload error", error)
        return null
    }
}