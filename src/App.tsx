import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Phone, MapPin, Clock, Star, Heart, ChefHat } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface OrderForm {
  name: string;
  phone: string;
  pickupDate: string;
  pickupTime: string;
  notes: string;
}

const App: React.Component = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    name: '',
    phone: '',
    pickupDate: '',
    pickupTime: '',
    notes: ''
  });

  const products: Product[] = [
    {
      id: 1,
      name: "經典檸檬磅蛋糕",
      description: "使用新鮮檸檬汁和檸檬皮製作，口感濕潤香甜，帶有清新的檸檬香氣。",
      price: 280,
      image: "/single.jpg",
      category: "磅蛋糕"
    },
    {
      id: 2,
      name: "七入磅蛋糕組",
      description: `中式 x 西點甜點混搭組合，輕盈酸甜的檸檬磅蛋糕
        使用新鮮雞蛋與檸檬原汁手工製作
        中秋限量供應，售完為止。`,
      price: 420,
      image: "/egg_single.jpg",
      category: "磅蛋糕"
    },
    {
      id: 3,
      name: "手工司康餅",
      description: "英式傳統司康餅，外酥內軟，搭配果醬享用更美味。",
      price: 180,
      image: "/in_02.jpg",
      category: "司康餅"
    },
    {
      id: 4,
      name: "季節水果塔",
      description: "使用當季新鮮水果製作，酥脆塔皮配上香滑卡士達醬。",
      price: 320,
      image: "/in_03.jpg",
      category: "水果塔"
    }
  ];

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(item => item.id !== productId);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 這裡可能是造成停頓的地方 - 讓我檢查處理邏輯
    console.log('訂單資料:', {
      items: cart,
      customerInfo: orderForm,
      total: getTotalPrice()
    });

    // 模擬處理時間 - 這可能是問題所在
    setTimeout(() => {
      alert(`感謝您的訂購！\n\n訂購人：${orderForm.name}\n電話：${orderForm.phone}\n取貨日期：${orderForm.pickupDate}\n取貨時間：${orderForm.pickupTime}\n總金額：NT$ ${getTotalPrice()}`);
      
      // 清空購物車和表單
      setCart([]);
      setOrderForm({
        name: '',
        phone: '',
        pickupDate: '',
        pickupTime: '',
        notes: ''
      });
      setIsOrderFormOpen(false);
      setIsCartOpen(false);
    }, 1000); // 這個 1 秒延遲可能是造成停頓的原因
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 動態設置背景圖片
  const getBannerStyle = () => {
    const isMobile = window.innerWidth < 768;
    return {
      backgroundImage: `url(${isMobile ? '/michiko_BN03.jpg' : '/BN01.jpg'})`
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-pink-600" />
              <h1 className="text-xl font-bold text-gray-900">michiko 咪匠人好食</h1>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={getBannerStyle()}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">手作甜點的美好時光</h2>
            <p className="text-lg md:text-xl mb-8">用心製作每一份甜蜜，讓美好時光更加珍貴</p>
            <button 
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 md:px-8 py-2 md:py-3 rounded-full text-base md:text-lg font-semibold transition-colors"
            >
              探索甜點
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">關於 michiko</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              我們堅持使用嚴選優質食材，手工精心製作每一份甜點。不添加人工防腐劑，
              讓您品嚐到最純粹的美味。每一口都是對品質的堅持，對美味的追求。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">用心製作</h3>
              <p className="text-gray-600">每一份甜點都是用心手工製作，注入滿滿的愛意</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">嚴選食材</h3>
              <p className="text-gray-600">堅持使用優質天然食材，不添加人工防腐劑</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">新鮮現做</h3>
              <p className="text-gray-600">接單後現做，確保每份甜點都是最新鮮的狀態</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">精選甜點</h2>
            <p className="text-lg text-gray-600">每一款都是精心調配的美味</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <span className="text-sm bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-pink-600">NT$ {product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>加入購物車</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">聯絡資訊</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-pink-600" />
                <div>
                  <h3 className="font-semibold">電話訂購</h3>
                  <p className="text-gray-600">0912-345-678</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-pink-600" />
                <div>
                  <h3 className="font-semibold">取貨地點</h3>
                  <p className="text-gray-600">台北市大安區忠孝東路四段123號</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Clock className="h-6 w-6 text-pink-600" />
                <div>
                  <h3 className="font-semibold">營業時間</h3>
                  <p className="text-gray-600">週二至週日 10:00-18:00</p>
                  <p className="text-gray-500 text-sm">週一公休</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">訂購須知</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 請提前1-2天預訂</li>
                <li>• 現金付款，取貨時付清</li>
                <li>• 如需取消請提前24小時告知</li>
                <li>• 甜點請於當日享用完畢</li>
                <li>• 如有食物過敏請事先告知</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ChefHat className="h-6 w-6 text-pink-400" />
              <span className="text-lg font-semibold">michiko 咪匠人好食</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 michiko 手作甜點. 用心製作每一份甜蜜時光
            </p>
          </div>
        </div>
      </footer>

      {/* Shopping Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">購物車</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">購物車是空的</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">NT$ {item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">總計</span>
                  <span className="text-lg font-bold text-pink-600">NT$ {getTotalPrice()}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsOrderFormOpen(true);
                  }}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  前往結帳
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {isOrderFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">訂購資訊</h2>
                <button
                  onClick={() => setIsOrderFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <form onSubmit={handleOrderSubmit} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={orderForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    電話 *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={orderForm.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    取貨日期 *
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={orderForm.pickupDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    取貨時間 *
                  </label>
                  <select
                    name="pickupTime"
                    value={orderForm.pickupTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">請選擇時間</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    備註
                  </label>
                  <textarea
                    name="notes"
                    value={orderForm.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="特殊需求或備註事項"
                  />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">總金額</span>
                  <span className="text-lg font-bold text-pink-600">NT$ {getTotalPrice()}</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  送出訂購
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;