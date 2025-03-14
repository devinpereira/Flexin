import React from 'react';
import { AiFillHeart } from 'react-icons/ai';

const FavoritesView = ({ favorites = [], onRemoveFavorite }) => {
  return (
    <div>
      {/* Page Heading */}
      <h2 className="text-white text-2xl font-bold mb-4">Favorites</h2>
      <hr className="border-gray-600 mb-4" />

      {favorites.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-white text-lg mb-4">You haven't added any favorites yet.</p>
          <p className="text-white/70">Browse products and click the heart icon to add items to your favorites.</p>
        </div>
      ) : (
        <>
          <p className="text-center text-white mb-6">{favorites.length} items in your favorites</p>
          
          {/* Favorites Grid */}
          <div className="grid grid-cols-5 gap-6 mb-12">
            {favorites.map((product, i) => (
              <div
                key={product.id || i}
                className="w-[161px] h-[236px] relative origin-top-left rounded outline-1 outline-offset-[-1px] outline-white/30 bg-black/30 backdrop-blur-sm p-4"
              >
                {product.discount && (
                  <div className="w-[29px] h-[29px] absolute top-0 right-0 bg-[#e50909] rounded-tr-sm rounded-bl-[7px] flex items-center justify-center text-white text-xs">
                    {product.discount}%
                  </div>
                )}
                <button 
                  onClick={() => onRemoveFavorite(product.id || i)}
                  className="absolute top-2 left-2 z-10 text-[#f67a45] bg-black/30 rounded-full p-1"
                >
                  <AiFillHeart size={22} />
                </button>
                <div className="w-full h-32 bg-gray-700/30 mb-4 rounded-lg flex items-center justify-center">
                  <img
                    src={`/src/assets/products/product${(i % 5) + 1}.png`}
                    alt={product.name || `Favorite ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-medium mb-1">{product.name || `Product ${i + 1}`}</h3>
                  <p className="text-[#f67a45] text-sm">${product.price || '99.99'}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesView;