import { ObjectId } from "mongodb";
import Image from "next/image";
import Link from "next/link";
interface ProductProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductCard({ id, name, price, image, category }: ProductProps) {
  return (
    <>
    
    <div className=" group relative flex flex-col  overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* <Link href={`detail/${product.id}`}>hello</Link> */}
    <Link href={`/detail/${id}`} className="relative inline-block">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {category}
        </span>
        
        <h3 className="text-lg font-semibold text-gray-800">
            <span aria-hidden="true" className="absolute inset-0" />
            {name}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <p className="text-xl font-bold text-gray-900">${price.toFixed(2)}</p>
          
        </div>
      </div>
                </Link>
          <button className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
                />
            </svg>
            
          </button>
    </div>
          </>
          
  );
}