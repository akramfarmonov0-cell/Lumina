import logoImage from '@assets/generated_images/lumina_ai_logo.png';
import watchImage from '@assets/generated_images/smart_watch_product.png';
import droneImage from '@assets/generated_images/ai_drone_product.png';
import headsetImage from '@assets/generated_images/neural_headset_product.png';

export const assets = {
  logo: logoImage,
};

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  aiAnalysis: {
    sentiment: string;
    keywords: string[];
    prediction: string;
  };
}

export const products: Product[] = [
  {
    id: 1,
    title: "Chronos AI Smartwatch",
    price: 299,
    image: watchImage,
    category: "Wearables",
    aiAnalysis: {
      sentiment: "Positive (98%)",
      keywords: ["biometric", "holographic", "titanium"],
      prediction: "High demand expected in Q4",
    },
  },
  {
    id: 2,
    title: "AeroSentinel Drone",
    price: 899,
    image: droneImage,
    category: "Robotics",
    aiAnalysis: {
      sentiment: "Neutral (85%)",
      keywords: ["autonomous", "surveillance", "4k"],
      prediction: "Steady growth in enterprise sector",
    },
  },
  {
    id: 3,
    title: "NeuroLink Interface",
    price: 1499,
    image: headsetImage,
    category: "Medical",
    aiAnalysis: {
      sentiment: "Excited (92%)",
      keywords: ["bci", "neural", "experimental"],
      prediction: "Breakthrough potential",
    },
  },
  {
    id: 4,
    title: "Quantum Data Core",
    price: 4500,
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80",
    category: "Computing",
    aiAnalysis: {
      sentiment: "Positive (95%)",
      keywords: ["quantum", "processing", "server"],
      prediction: "Limited stock warning",
    },
  },
  {
    id: 5,
    title: "Holo-Display V2",
    price: 699,
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80",
    category: "Displays",
    aiAnalysis: {
      sentiment: "Positive (88%)",
      keywords: ["hologram", "3d", "interactive"],
      prediction: "Trending in gaming sector",
    },
  },
];
