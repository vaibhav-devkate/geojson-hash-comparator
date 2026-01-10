# GeoJSON Hash Comparator

A premium, secure, and fast web application to compare two GeoJSON files using SHA256 hashing. Built with Next.js, Tailwind CSS, and Framer Motion.

## 🚀 How it Works

The GeoJSON Hash Comparator uses a secure, browser-based approach to verify if two GeoJSON files are identical in content.

1. **Local Processing**: When you upload a file, it is read directly in your browser. The file content **never leaves your device** and is never uploaded to any server.
2. **SHA256 Hashing**: The application generates a unique SHA256 hash of the file content. SHA256 is a cryptographic hash function that produces a fixed-size 256-bit (32-byte) hash.
3. **Comparison**: The hashes of the two files are compared. If the hashes match perfectly, the files are identical. If even a single character is different, the hashes will be completely different.
4. **Instant Feedback**: The result is displayed instantly with a premium UI, showing whether the files match or differ.

## ✨ Features

- **Privacy First**: All processing happens locally in the browser.
- **SHA256 Security**: Uses industry-standard cryptographic hashing for comparison.
- **Premium UI**: Smooth animations and a clean, modern interface.
- **Fast**: Instant results even for large GeoJSON files.

## 🛠️ Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment

This project is optimized for deployment on the [Vercel Platform](https://vercel.com).

## 🔗 Links

- **Live Demo**: [geohash.vaibhavvdevkate.com](https://geohash.vaibhavvdevkate.com)
- **Source Code**: [GitHub Repository](https://github.com/vaibhav-devkate/geojson-hash-comparator)

---
Made with love by [Vaibhav Devkate](https://vaibhavvdevkate.com/)
