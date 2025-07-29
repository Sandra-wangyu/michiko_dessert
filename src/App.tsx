import React, { useState } from 'react';
import { Heart, MapPin, Clock, Phone, Facebook, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';

const App = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    '/BN01.jpg',
    '/LINE_ALBUM_Michiko_250729_12.jpg',
    '/LINE_ALBUM_Michiko_250729_11.jpg'
  ];

  const products = [
    {
      id: 1,
      name: '經典原味蛋糕',
      price: '280',
      image: '/egg_single.jpg',
      description: '使用新鮮雞蛋與優質麵粉製作，口感綿密香甜'
    },
    {
      id: 2,
      name: '巧克力蛋糕',
      price: '320',
      image: '/single.jpg',
      description: '濃郁巧克力香氣，搭配細緻蛋糕體'
    },
    {
      id: 3,
      name: '季節限定蛋糕',
      price: '350',
      image: '/S__40509442.jpg',
      description: '依季節推出不同口味，每一口都是驚喜'
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-pink-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">michiko</h1>
                <p className="text-sm text-gray-600">咪匠人好食</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#products" className="text-gray-700 hover:text-pink-500 transition-colors">商品</a>
              <a href="#about" className="text-gray-700 hover:text-pink-500 transition-colors">關於我們</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-500 transition-colors">聯絡我們</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Carousel */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="relative w-full h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
          
          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">手作甜點</h2>
            <p className="text-xl md:text-2xl mb-8">用心製作每一份甜蜜</p>
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors">
              立即訂購
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">精選商品</h2>
            <p className="text-gray-600 text-lg">每一款都是用心製作的美味</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-500">NT$ {product.price}</span>
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition-colors">
                      訂購
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">關於 michiko</h2>
              <p className="text-gray-600 text-lg mb-6">
                我們相信，每一個甜點都承載著製作者的心意。在 michiko，我們堅持使用最優質的食材，
                以傳統手工技法結合現代創意，為您帶來最純粹的甜蜜體驗。
              </p>
              <p className="text-gray-600 text-lg mb-8">
                從選料到製作，每一個步驟都經過精心安排，不添加人工防腐劑，
                讓您品嚐到最天然、最健康的美味。
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="text-gray-700">用心製作</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="text-gray-700">天然食材</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="text-gray-700">手工製作</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/S__40509450_0.jpg"
                alt="關於我們"
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">聯絡我們</h2>
            <p className="text-gray-600 text-lg">歡迎聯繫我們，讓美好時光更加珍貴</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-pink-500" />
                <h3 className="text-lg font-medium text-gray-800">營業時間</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <p>週一至週五：09:00 - 18:00</p>
                <p>週六至週日：10:00 - 17:00</p>
                <p className="text-sm text-pink-500">※ 國定假日休息</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Phone className="w-6 h-6 text-pink-500" />
                <h3 className="text-lg font-medium text-gray-800">電話訂購</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <p className="text-xl font-medium">0912-345-678</p>
                <p className="text-sm">建議提前 1-2 天預訂</p>
                <p className="text-sm text-pink-500">※ 客製化商品需提前 3-5 天</p>
              </div>
            </div>
          </div>

          <div>
            {/* 訂購品項 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-gray-800 mb-4">訂購品項</h3>
              <div className="space-y-2">
                <p className="text-gray-600">• 經典原味蛋糕 - NT$ 280</p>
                <p className="text-gray-600">• 巧克力蛋糕 - NT$ 320</p>
                <p className="text-gray-600">• 季節限定蛋糕 - NT$ 350</p>
                <p className="text-gray-600">• 客製化蛋糕 - 價格面議</p>
              </div>
            </div>

            {/* 社群媒體和面交地點 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-center items-center gap-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-6 h-6 text-gray-600" />
                  <span className="text-sm text-gray-600">台北市信義區面交</span>
                </div>
                <a
                  href="https://www.facebook.com/michiko咪匠人好食"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                  <span className="text-sm">michiko咪匠人好食</span>
                </a>
                <a
                  href="https://www.instagram.com/michiko咪匠人好食"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                  <span className="text-sm">michiko咪匠人好食</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Heart className="w-6 h-6 text-pink-500" />
            <span className="text-xl font-semibold">michiko 咪匠人好食</span>
          </div>
          <p className="text-gray-400 mb-4">用心製作每一份甜蜜，讓美好時光更加珍貴</p>
          <p className="text-gray-500 text-sm">© 2024 michiko. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;