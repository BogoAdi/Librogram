using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.Versioning;

namespace CorporateSocialNetwork.Application.utils
{
    [SupportedOSPlatform("windows")]
    public static class ImageManipulation
    {
        public static string GetImageExtension(Stream stream)
        {
            Image image = Image.FromStream(stream);
            string imageFormat = null;

            if (ImageFormat.Png.Equals(image.RawFormat))
            {
                imageFormat = "png";
            }
            else if (ImageFormat.Jpeg.Equals(image.RawFormat))
            {
                imageFormat = "jpg";
            }

            return imageFormat;
        }
    }
}