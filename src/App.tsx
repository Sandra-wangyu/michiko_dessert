import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Phone, MapPin, Clock, Refrigerator, Truck } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: '經典原味蛋糕',
    price: 380,
    image: '/egg_single.jpg',
    rating: 4.8,
    description: '使用優質雞蛋與麵粉，口感綿密香甜'
  },
  {
    id: 2,
    name: '巧克力蛋糕',
    price: 420,
    image: '/single.jpg',
    rating: 4.9,
    description: '濃郁巧克力香氣，層次豐富的甜點體驗'
  },
  {
    id: 3,
    name: '草莓蛋糕',
    price: 450,
    image: '/BN01.jpg',
    rating: 4.7,
    description: '新鮮草莓搭配輕盈奶油，酸甜平衡'
  }
];

function App() {
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [favorites, setFavorites] = useState<number[]>([]);

  // const addToCart = (productId: number) => {
  //   setCart(prev => ({
  //     ...prev,
  //     [productId]: (prev[productId] || 0) + 1
  //   }));
  // };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  michiko 咪匠人好食
                </h1>
                <p className="text-sm text-gray-600">手作甜點</p>
              </div>
            </div>
            
            <div className="relative">
              <button className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">購物車</span>
                {getTotalItems() > 0 && (
                  <span className="bg-white text-pink-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-orange-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            用心製作
            <span className="block bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              每一份甜蜜
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            採用嚴選優質食材，手工精心製作，不添加人工防腐劑
            <br />
            讓美好時光更加珍貴
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="text-gray-700">手工製作</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700">嚴選食材</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
              <Refrigerator className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700">新鮮製作</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">精選商品</h3>
            <p className="text-gray-600 text-lg">每一款都是用心之作</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        favorites.includes(product.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-800">{product.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                      NT$ {product.price}
                    </span>
                    <button
                      disabled
                      className="bg-gray-400 text-white px-6 py-2 rounded-full font-medium cursor-not-allowed transition-all duration-300"
                    >
                      中秋已截單
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Storage Information */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4">
              <Refrigerator className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">保存方式</h3>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Refrigerator className="w-5 h-5 text-blue-500 mr-2" />
                  冷藏保存
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    收到商品後請立即冷藏保存
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    建議在 2-3 天內享用完畢
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    食用前可回溫 10-15 分鐘
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Clock className="w-5 h-5 text-orange-500 mr-2" />
                  最佳賞味
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    新鮮製作，當日出貨
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    避免陽光直射及高溫環境
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    開封後請盡快享用
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Information */}
      <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">出貨資訊</h3>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <Truck className="w-5 h-5 text-green-500 mr-2" />
                  出貨方式
                </h4>
                <p className="text-gray-600 text-lg">宅配　ｏｒ　台南市面交（地點中西區）</p>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-5 h-5 text-blue-500 mr-2" />
                  出貨時段
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    <span className="font-medium text-gray-700">第一時段：</span>
                    <span className="text-gray-600 ml-2">9/8(一)依序出貨</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    <span className="font-medium text-gray-700">第二時段：</span>
                    <span className="text-gray-600 ml-2">9/15(一)依序出貨</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    <span className="font-medium text-gray-700">第三時段：</span>
                    <span className="text-gray-600 ml-2">9/22(一)依序出貨</span>
                  </div>
                  <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                    <span className="font-medium text-red-700">第四時段：</span>
                    <span className="text-red-600 ml-2">9/30-10/02 僅接受台南市面交</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">聯絡我們</h3>
            <p className="text-gray-600 text-lg">有任何問題歡迎聯繫</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">電話聯絡</h4>
                  <p className="text-gray-600">歡迎來電詢問</p>
                </div>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                0912-345-678
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">面交地點</h4>
                  <p className="text-gray-600">台南市中西區</p>
                </div>
              </div>
              <p className="text-lg text-gray-700">
                詳細地點將於訂購後另行通知
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-bold">michiko 咪匠人好食</h4>
            </div>
            <p className="text-gray-400 mb-6">用心製作每一份甜蜜</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2024 michiko 咪匠人好食</span>
              <span>•</span>
              <span>手作甜點</span>
              <span>•</span>
              <span>台南製作</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;