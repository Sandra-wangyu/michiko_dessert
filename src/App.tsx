import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, Phone, MapPin, Clock, Package, Star, Heart, Award, Leaf } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  weight?: string;
  ingredients?: string;
  allergens?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface OrderData {
  customerName: string;
  customerPhone: string;
  deliveryTime: string;
  deliveryMethod: string;
  recipientName?: string;
  recipientPhone?: string;
  shippingAddress?: string;
  specialRequests?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "六入蛋黃酥組",
    description: "內容物：6 顆蛋黃酥／綠豆椪，自由搭配（每種口味至少 2 顆起跳）\n✅ 傳統與創新一次擁有，酥香濃郁、入口即化！",
    price: 390,
    image: "/S__40509450_0.jpg",
    category: "組合A"
  },
  {
    id: 2,
    name: "六入磅蛋糕組",
    description: "內容物：蛋黃酥／綠豆椪 任選 3 顆 ＋ 檸檬磅蛋糕 4 片\n✅ 中式 x 西點甜點混搭組合，送禮自享兩相宜\n✅ 嚴選嘉禾粉心粉 × 台灣19號奶油，口感更升級",
    price: 399,
    image: "/S__40509453_0.jpg",
    category: "組合B"
  },
  {
    id: 3,
    name: "好日子蛋黃酥",
    description: "闆娘親手製作，真材實料整顆鹹蛋黃包入，餅皮不含豬油，口感清爽不油膩",
    price: 65,
    image: "/S__40509442.jpg",
    category: "單品",
    weight: "75g",
    ingredients: "烏豆沙餡〔圓雲豆、蔗糖、麥芽糖、台灣19號奶油、大豆油、甜味劑(赤藻醣醇)、海藻糖、麥芽糊精、玫瑰鹽、黏稠劑(玉米糖膠)〕、嘉禾中筋粉心粉、低筋麵粉、台灣19號無水奶油、玄米油、鹹蛋黃（含花生油）、砂糖、水、蛋黃、黑芝麻",
    allergens: "本產品含有蛋類、奶類、芝麻、大豆、小麥、花生及其製品，不適合其過敏體質者食用。"
  },
  {
    id: 4,
    name: "好日子綠豆椪",
    description: "綿密細緻綠豆餡，餡料單純紮實，內餡重達 40g，不含豬油清爽口感",
    price: 60,
    image: "/S__40509452_0.jpg",
    category: "單品",
    weight: "70g",
    ingredients: "綠豆沙（綠豆、砂糖、食用油、鹽）、嘉禾中筋粉心粉、低筋麵粉、台灣19號無水奶油、玄米油、砂糖、水",
    allergens: "本產品含有奶類、小麥及其製品，不適合其過敏體質者食用。"
  },
  {
    id: 5,
    name: "輕日子檸檬磅蛋糕",
    description: "使用台灣19號無鹽發酵奶油，搭配新鮮檸檬汁，口感濕潤香甜",
    price: 45,
    image: "/S__40509455_0.jpg",
    category: "單品",
    weight: "35g",
    ingredients: "台灣19號無鹽發酵奶油（乳脂、發酵菌種）、雞蛋、低筋麵粉、糖粉（砂糖、玉米澱粉）、細砂糖、檸檬汁、牛奶、鹽",
    allergens: "本產品含有蛋類、奶類、小麥及其製品，不適合其過敏體質者食用。"
  }
];

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleOrderSubmit = async (orderData: OrderData) => {
    const subtotal = getTotalPrice();
    const shippingFee = orderData.deliveryMethod === '宅配' && subtotal < 2000 ? 180 : 0;
    
    const completeOrderData = {
      ...orderData,
      timestamp: new Date().toLocaleString('zh-TW'),
      orderNumber: 'MICH' + Date.now(),
      items: cart,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee
    };

    console.log('訂單資料:', completeOrderData);
    
    // 這裡可以整合實際的訂單處理 API
    alert(`訂單已成功送出！\n訂單編號：${completeOrderData.orderNumber}\n我們會盡快與您聯繫確認訂單詳情。`);
    
    // 重置狀態
    setCart([]);
    setShowOrderForm(false);
    setIsCartOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'intro', 'products', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800 tracking-wider">MICHIKO</h1>
              <div className="ml-2 text-xs text-gray-500 font-light">手作甜點</div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {[
                { id: 'home', label: '首頁' },
                { id: 'intro', label: '品牌故事' },
                { id: 'products', label: '甜點選購' },
                { id: 'contact', label: '聯絡方式' }
              ].map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'text-amber-600 border-b-2 border-amber-600'
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-light text-gray-800 mb-4 tracking-wide">
              MICHIKO
            </h1>
            <div className="w-24 h-0.5 bg-amber-400 mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              用心製作每一份甜蜜<br />
              讓美好時光更加珍貴
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center text-gray-600 text-sm">
              <Award className="w-4 h-4 mr-2 text-amber-500" />
              精選食材
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Heart className="w-4 h-4 mr-2 text-amber-500" />
              手工製作
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Leaf className="w-4 h-4 mr-2 text-amber-500" />
              天然無添加
            </div>
          </div>

          <a
            href="#intro"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            探索更多
          </a>
        </div>
      </section>

      {/* Brand Story Section */}
      <section id="intro" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-800 mb-4">關於michiko咪匠人好食</h2>
            <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-6"></div>
            <div className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed space-y-4">
              <p>這個品牌，走過第六個年頭。<br />我是品牌師、行銷人，也是甜點師。</p>
              <p>因為愛吃，<br />也因為想讓家人吃得安心、吃得開心。<br />身在食品產業的我，選擇親手學、親手做。</p>
              <p>每一樣食材都看得懂，<br />每一口用心都吃得到。</p>
              <p>我媽常說：「要做自己也敢吃的，才算對。」<br />所以你吃到的每一份甜點，<br />不只是好吃，<br />更是我們對食材的堅持，與生活的用心。</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-amber-500 mr-3" />
                  <h3 className="text-xl font-medium text-gray-800">🍂 闆娘手作，讓點心也有溫度</h3>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-2 text-sm">
                  <p>✿ 每一顆都由闆娘親手製作，用心手包，只為你入口那一刻的幸福感</p>
                  <p>✿ 餅皮全程不含豬油，選用植物油與高品質奶油，口感清爽、不油膩（蛋奶素可食）</p>
                  <p>✿ 真材實料「整顆鹹蛋黃」包入，絕非碎碎蛋或半顆唬弄版本！</p>
                  <p>✿ 不吃鹹蛋？也可選擇綿密細緻綠豆餡，餡料單純紮實，內餡重達 40g</p>
                  <p>✿ 全品項皆使用台灣之光「19號發酵奶油」，乳香濃郁，媲美歐洲頂級奶油</p>
                  <p className="font-medium text-amber-600">✨ 此次酥皮全面升級，真的好～酥！</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <Leaf className="w-6 h-6 text-amber-500 mr-3" />
                  <h3 className="text-xl font-medium text-gray-800">嚴選食材</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>• 台灣19號發酵奶油</div>
                  <div>• 嘉禾粉心粉</div>
                  <div>• 新鮮鹹蛋黃</div>
                  <div>• 綠豆沙餡</div>
                  <div>• 新鮮檸檬汁</div>
                  <div>• 玄米油</div>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                <div className="flex items-center mb-4">
                  <Package className="w-6 h-6 text-amber-600 mr-3" />
                  <h3 className="text-xl font-medium text-gray-800">保存方式</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  請置於陰涼乾燥處保存，開封後請盡快食用完畢。冷藏保存可延長保鮮期，食用前回溫口感更佳。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="/S__40509450_0.jpg" 
                    alt="精緻甜點" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="/S__40509453_0.jpg" 
                    alt="手工製作" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="/S__40509455_0.jpg" 
                    alt="精美包裝" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="/S__40509452_0.jpg" 
                    alt="新鮮食材" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-800 mb-4">商品選購</h2>
            <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              每一款甜點都是闆娘的用心之作，選用最優質的食材，呈現最完美的味覺體驗
            </p>
          </div>

          {/* 封面款式說明 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="text-center">
              <Package className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">📦 封面款式說明</h3>
              <p className="text-gray-600">三款設計任選｜哈欠狗、厭世貓、慵懶貓（適用於所有組合，如未指定將隨機出貨）</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {/* 成分與過敏原資訊區 */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-light text-gray-800 mb-4">成分與過敏原資訊</h3>
              <div className="w-16 h-0.5 bg-amber-400 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.filter(product => product.weight).map(product => (
                <div key={`info-${product.id}`} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="text-center mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-full mx-auto mb-3"
                    />
                    <h4 className="text-lg font-medium text-gray-800">{product.name}</h4>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">淨重：</span>
                      <span className="text-gray-600">{product.weight}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">成分：</span>
                      <p className="text-gray-600 leading-relaxed mt-1">{product.ingredients}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <span className="font-medium text-red-700">過敏原：</span>
                      <p className="text-red-600 text-xs leading-relaxed mt-1">{product.allergens}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Summary */}
          {cart.length > 0 && (
            <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center">
                <h3 className="text-2xl font-medium text-gray-800 mb-6">購物車總覽</h3>
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-700">{item.name} × {item.quantity}</span>
                      <span className="font-medium text-gray-800">NT$ {item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 text-lg font-medium text-gray-800">
                    <span>總計 ({getTotalItems()} 件商品)</span>
                    <span>NT$ {getTotalPrice()}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="px-6 py-3 border border-amber-500 text-amber-600 rounded-full hover:bg-amber-50 transition-colors"
                  >
                    查看購物車詳情
                  </button>
                  <button
                    onClick={() => setShowOrderForm(true)}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors"
                  >
                    前往結帳
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light text-gray-800 mb-4">聯絡方式</h2>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6">
              <Phone className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">電話訂購</h3>
              <p className="text-gray-600">0912-345-678</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <MapPin className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">面交地點</h3>
              <p className="text-gray-600">台南市中西區</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <Clock className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">營業時間</h3>
              <p className="text-gray-600">週一至週日<br />9:00 - 18:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setShowOrderForm(true);
        }}
      />

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderFormModal
          cart={cart}
          onClose={() => setShowOrderForm(false)}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product, quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">{product.name}</h3>
        <div className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">{product.description}</div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-medium text-amber-600">NT$ {product.price}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          onClick={() => onAddToCart(product, quantity)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-full font-medium transition-colors"
        >
          加入購物車
        </button>
      </div>
    </div>
  );
}

// Cart Sidebar Component
function CartSidebar({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}: {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      )}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-800">購物車</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">購物車是空的</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-amber-600">NT$ {item.price}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-800">總計</span>
              <span className="text-xl font-medium text-amber-600">NT$ {total}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-full font-medium transition-colors"
            >
              前往結帳
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Order Form Modal Component
function OrderFormModal({ 
  cart, 
  onClose, 
  onSubmit 
}: {
  cart: CartItem[];
  onClose: () => void;
  onSubmit: (data: OrderData) => void;
}) {
  const [formData, setFormData] = useState<OrderData>({
    customerName: '',
    customerPhone: '',
    deliveryTime: '',
    deliveryMethod: '',
    recipientName: '',
    recipientPhone: '',
    shippingAddress: '',
    specialRequests: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = formData.deliveryMethod === '宅配' && subtotal < 2000 ? 180 : 0;
  const total = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-gray-800">訂購表單</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 訂購人資訊 */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-gray-800 mb-4">訂購人資訊</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  訂購人姓名 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  訂購人電話 *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 訂購品項 */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-gray-800 mb-4">訂購品項</h3>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-gray-700">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-gray-800">NT$ {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 出貨時間 */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-gray-800 mb-4">出貨時間</h3>
            <div className="space-y-2">
              {['第一時段', '第二時段', '第三時段'].map(time => (
                <label key={time} className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryTime"
                    value={time}
                    required
                    onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                    className="mr-3 text-amber-500 focus:ring-amber-500"
                  />
                  {time}
                </label>
              ))}
            </div>
          </div>

          {/* 配送方式 */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-gray-800 mb-4">配送方式</h3>
            <div className="space-y-2 mb-4">
              {['台南市面交', '宅配'].map(method => (
                <label key={method} className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value={method}
                    required
                    onChange={(e) => setFormData({...formData, deliveryMethod: e.target.value})}
                    className="mr-3 text-amber-500 focus:ring-amber-500"
                  />
                  {method}
                </label>
              ))}
            </div>

            {formData.deliveryMethod === '宅配' && (
              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-gray-800">寄送資訊</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      收件人姓名
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      收件人電話
                    </label>
                    <input
                      type="tel"
                      value={formData.recipientPhone}
                      onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    收件地址
                  </label>
                  <textarea
                    rows={2}
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                    placeholder="請填寫完整地址，包含郵遞區號"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 費用總計 */}
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>商品小計：</span>
                <span>NT$ {subtotal}</span>
              </div>
              {formData.deliveryMethod === '宅配' && (
                <div className="flex justify-between">
                  <span>常溫運費：</span>
                  <span>NT$ {shippingFee}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-medium text-amber-700 border-t border-amber-200 pt-2">
                <span>總計：</span>
                <span>NT$ {total}</span>
              </div>
            </div>
            {formData.deliveryMethod === '宅配' && (
              <p className="text-sm text-amber-600 mt-2">
                💡 常溫運費 $180，總訂購金額滿 $2000 免收運費
              </p>
            )}
          </div>

          {/* 特殊需求 */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-gray-800 mb-4">特殊需求</h3>
            <textarea
              rows={3}
              value={formData.specialRequests}
              onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
              placeholder="過敏提醒、特殊包裝需求、配送備註等..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-full text-lg font-medium transition-colors"
          >
            確認訂購
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;