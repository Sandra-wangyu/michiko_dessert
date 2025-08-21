import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, Phone, MapPin, Clock, Package, Star, Heart, Award, Leaf, Facebook, Instagram } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  type: 'combo' | 'single';
  options?: string[];
  hasVariants?: boolean;
}

interface CartItem extends Product {
  quantity: number;
  selectedOption?: string;
  coverStyle?: string;
}

interface OrderData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
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
    name: "六入好日子組",
    description: "酥到掉渣的中式雙享組合，蛋黃酥也好，綠豆椪也好，都是節日裡剛剛好的幸福選擇。",
    price: 390,
    image: "/gif_05.jpg",
    category: "組合A",
    type: "combo",
    options: ["蛋黃酥 3 + 綠豆椪 3", "蛋黃酥 6", "綠豆椪 6"],
    hasVariants: true
  },
  {
    id: 2,
    name: "七入磅蛋糕組",
    description: `中式 x 西點甜點混搭組合，輕盈酸甜的檸檬磅蛋糕｜使用新鮮雞蛋與檸檬原汁手工製作｜中秋限量供應，售完為止。`,
    price: 420,
    image: "/6gif.jpg",
    category: "組合B",
    type: "combo",
    options: ["蛋黃酥 3 + 檸檬磅蛋糕 4 片", "綠豆椪 3 + 檸檬磅蛋糕 4 片"],
    hasVariants: true
  },
  {
    id: 3,
    name: "好日子蛋黃酥(無禮盒)",
    description: "(單入裝，無禮盒) 真材實料整顆鹹蛋黃包入，餅皮不含豬油，口感清爽不油膩",
    price: 60,
    image: "/egg_single.jpg",
    category: "單品",
    type: "single"
  },
  {
    id: 4,
    name: "好日子綠豆椪(無禮盒)",
    description: "(單入裝，無禮盒) 綿密細緻綠豆餡，內餡重達40g，不含豬油清爽口感",
    price: 60,
    image: "/single.jpg",
    category: "單品",
    type: "single"
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

  const addToCartWithOptions = (product: Product, quantity: number = 1, selectedOption?: string, coverStyle?: string) => {
    const cartItem: CartItem = {
      ...product,
      quantity,
      selectedOption,
      coverStyle
    };
    
    setCart(prevCart => {
      // 對於有選項的商品，需要檢查選項是否相同
      const existingItem = prevCart.find(item => 
        item.id === product.id && 
        item.selectedOption === selectedOption &&
        item.coverStyle === coverStyle
      );
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && 
          item.selectedOption === selectedOption &&
          item.coverStyle === coverStyle
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, cartItem];
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
    
    // 生成新格式的訂單編號：mich + 日期 + 序號
    const today = new Date();
    const dateStr = today.getFullYear().toString() + 
                   (today.getMonth() + 1).toString().padStart(2, '0') + 
                   today.getDate().toString().padStart(2, '0');
    const timeStamp = Date.now().toString().slice(-3); // 使用時間戳後3位作為序號
    const orderNumber = `mich${dateStr}${timeStamp}`;
    
    const completeOrderData = {
      ...orderData,
      timestamp: new Date().toLocaleString('zh-TW'),
      orderNumber: orderNumber,
      items: cart,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee
    };

    try {
      console.log('提交訂單資料:', completeOrderData); // 除錯用
      
      const response = await fetch('https://script.google.com/macros/s/AKfycbxNqX6DOFFJZUtpXGmeW9w3dfOfp38XzKcbV56cdSbsHMaP0nentzfgRgeusig1iE4zJg/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeOrderData),
        mode: 'no-cors' // Google Apps Script 需要此設定
      });

      // 延遲一下確保資料傳送完成
      setTimeout(() => {
        alert(`✅ 訂單已成功送出！\n\n📋 🎀 我們已寄送MAIL給您確認訂購明細及匯款資訊，若於一天內未收到MAIL，請您私訊IG：michiko_dessert，會盡快與您聯繫。\n\n感謝您選擇 michiko 手作甜點！`);
      }, 500);
      
      // 重置狀態
      setCart([]);
      setShowOrderForm(false);
      setIsCartOpen(false);
      
    } catch (error) {
      console.error('訂單提交錯誤:', error);
      alert('❌ 訂單提交失敗，請稍後再試或直接聯繫我們。\n\n🎀 私訊IG：michiko_dessert');
    }
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
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
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
      <section id="home" className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: window.innerWidth >= 768 
              ? "url('/BN01.jpg')" 
              : "url('/michiko_BN03.jpg')"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-light text-white mb-4 tracking-wide">
              MICHIKO
            </h1>
            <div className="w-24 h-0.5 bg-amber-400 mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-white font-light leading-relaxed max-w-2xl mx-auto mb-8">
              用心製作每一份甜蜜<br />
              讓美好時光更加珍貴
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center text-white text-sm">
                <Award className="w-4 h-4 mr-2 text-amber-500" />
                精選食材
              </div>
              <div className="flex items-center text-white text-sm">
                <Heart className="w-4 h-4 mr-2 text-amber-500" />
                手工製作
              </div>
              <div className="flex items-center text-white text-sm">
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
        </div>
      </section>

      {/* Brand Story Section */}
      <section id="intro" className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-800 mb-4">關於michiko咪匠人好食</h2>
            <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-6"></div>
            <div className="text-sm text-gray-600 max-w-4xl mx-auto leading-relaxed space-y-2 font-light grid md:grid-cols-2 gap-6 text-left" style={{fontFamily: "'Noto Sans TC', cursive"}}>
              <div className="space-y-3">
                <p>這個品牌，走過第六個年頭。<br />我是品牌師、行銷人，也是甜點師。</p>
                <p>因為愛吃，<br />也因為想讓家人吃得安心、吃得開心。<br />身在食品產業的我，選擇親手學、親手做。</p>
              </div>
              <div className="space-y-3">
                <p><strong>每一樣食材都看得懂，<br />每一口用心都吃得到。</strong></p>
                <p>我媽常說：「要做自己也敢吃的，才算對。」<br />所以你吃到的每一份甜點，<br />不只是好吃，<br />更是我們對食材的堅持，與生活的用心。</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-amber-500 mr-3" />
                  <h3 className="text-xl font-medium text-gray-800">闆娘手作，讓點心也有溫度</h3>
                </div>
                <div className="text-gray-600 leading-relaxed space-y-2 text-sm font-light" style={{fontFamily: "'Noto Sans TC', cursive"}}>
                  <p>✿ 每一顆都由闆娘手工製作，酥到掉渣</p>
                  <p>✿ 不含豬油，選用植物油＋台灣LV等級「19號奶油」，清爽不膩</p>
                  <p>✿ 真材實料「整顆鹹蛋黃」包入，絕非碎蛋或半顆唬弄版本！</p>
                  <p>✿ 不吃鹹蛋也有綿密綠豆餡可選，內餡足足40g</p>
                  <p>✿ 蛋奶素也可食，獨家工法也保有層次酥度</p>
                  <p className="font-medium text-amber-600">✨ 此次酥皮全面升級，真的好～酥！</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <Leaf className="w-6 h-6 text-amber-500 mr-3" />
                  <h3 className="text-lg font-medium text-gray-800">嚴選食材</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>• 台灣之光「19號奶油」</div>
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
                  <h3 className="text-lg font-medium text-gray-800">保存方式</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  ▪ 蛋黃酥 & 磅蛋糕保存方式：請放置陰涼乾燥處，避免日照與高溫，常溫保存5天風味最佳 / 冷藏7天，若蛋黃酥冷藏建議回烤使酥皮恢復酥脆口感。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                  <img 
                    src="/S__40509450_0.jpg" 
                    alt="手作甜點" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
                  <img 
                    src="/gif_03.jpg" 
                    alt="手工製作" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-amber-100 to-amber-200">
                  <img 
                    src="/gif_02.jpg" 
                    alt="新鮮食材" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-50 to-gray-150">
                  <img 
                    src="/gif_07.jpg" 
                    alt="精美包裝" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-50 to-gray-150">
                  <img 
                    src="/gif_06.jpg" 
                    alt="精美包裝" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-50 to-gray-150">
                  <img 
                    src="/S__40509583.jpg" 
                    alt="精美包裝" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gift Box Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-800 mb-4">這次，我們用更環保的方式裝載心意</h2>
              <div className="w-16 h-0.5 bg-amber-400 mx-auto"></div>
            </div>
            
            {/* Banner Images */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* First Banner */}
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="/LINE_ALBUM_Michiko_250729_11.jpg" 
                  alt="精美禮盒設計" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-6">
                    <h3 className="text-xl font-medium mb-2">角釘盒包裝</h3>
                    <p className="text-sm leading-relaxed opacity-90">
                      無膠角釘禮盒，100% 再生牛奶盒紙板<br />
                      環保材質，溫潤質感
                    </p>
                  </div>
                </div>
              </div>

              {/* Second Banner */}
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="/LINE_ALBUM_Michiko_250729_12.jpg" 
                  alt="無墨壓印工藝" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-6">
                    <h3 className="text-xl font-medium mb-2">無墨壓印工藝</h3>
                    <p className="text-sm leading-relaxed opacity-90">
                      LOGO 採用無墨壓印，不上色、不燙金<br />
                      值得被留下來被回憶的禮盒
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
              <div className="text-gray-600 leading-relaxed space-y-4 text-center max-w-3xl mx-auto" style={{fontFamily: "'Noto Sans TC', cursive"}}>
                <p className="text-lg">
                  這次特別訂製了無膠角釘禮盒，<br />沒有使用膠水與雙面膠，<br />
                  從外盒到內襯，<br />皆選用100% 再生牛奶盒紙板。
                </p>
                <p className="text-lg">
                  LOGO 採用無墨壓印工藝，<br />不上色、不燙金，<br />
                  我們希望這份禮盒，<br />不只是中秋後的垃圾，<br />
                  而是能被留下來的記憶。
                </p>
              </div>
            </div>

            {/* 封面款式說明 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <Package className="w-8 h-8 text-amber-500 mr-3" />
                <h3 className="text-xl font-medium text-gray-800">封面款式說明</h3>
              </div>
              
              {/* 三張角色 Banner */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* 哈欠狗 */}
                <div className="text-center">
                  <div className="h-64 rounded-2xl overflow-hidden shadow-lg mb-4">
                    <img 
                      src="/dog_page-0001.jpg" 
                      alt="哈欠狗封面" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-medium mb-2 text-gray-800">哈欠狗</h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    慵懶可愛的哈欠表情<br />
                    療癒系角色設計
                  </p>
                </div>

                {/* 厭世貓 */}
                <div className="text-center">
                  <div className="h-64 rounded-2xl overflow-hidden shadow-lg mb-4">
                    <img 
                      src="/cat2_page-0001.jpg"               
                      alt="厭世貓封面" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-medium mb-2 text-gray-800">厭世貓</h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    經典厭世表情<br />
                    都市人的心聲代表
                  </p>
                </div>

                {/* 慵懶貓 */}
                <div className="text-center">
                  <div className="h-64 rounded-2xl overflow-hidden shadow-lg mb-4">
                    <img 
                      src="/cat_page-0001.jpg" 
                      alt="慵懶貓封面" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-medium mb-2 text-gray-800">慵懶貓</h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    放鬆慵懶的姿態<br />
                    享受悠閒時光
                  </p>
                </div>
              </div>
              
              {/* 底部說明文字 */}
              <div className="text-center text-gray-600 space-y-1 mt-6">
                <p className="text-base">三款角色封面任選：哈欠狗、厭世貓、慵懶貓</p>
                <p className="text-xs">適用所有禮盒組合(單入裝則無)｜如需指定請於下單時選擇，若未指定將隨機出貨。</p>
              </div>
            </div>
          </div>
        </section>
      </section>

        {/* 出貨資訊 */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-amber-800">出貨資訊</h2>
            <div className="bg-amber-50 rounded-lg p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-amber-800">出貨方式</h3>
                <p className="text-gray-700">宅配　ｏｒ　台南市面交（地點中西區）</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-amber-800">出貨時段</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mr-4">第一時段</span>
                    <span className="text-gray-700">9/8(一)依序出貨</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mr-4">第二時段</span>
                    <span className="text-gray-700">9/15(一)依序出貨</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mr-4">第三時段</span>
                    <span className="text-gray-700">9/22(一)依序出貨</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium mr-4">第四時段</span>
                    <span className="text-gray-700">9/30-10/02 僅接受台南市面交</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      {/* Products Section */}
      <section id="products" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-800 mb-4">商品選購</h2>
            <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              每一款都是闆娘的用心之作，選用最優質的食材，給家人吃的心意。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCartWithOptions}
              />
            ))}
          </div>

          {/* 購物車總覽 */}
          {cart.length > 0 && (
            <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center">
                <h3 className="text-2xl font-medium text-gray-800 mb-6">購物車總覽</h3>
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  {cart.map(item => (
                    <div key={`${item.id}-${item.selectedOption}-${item.coverStyle}`} className="py-3 border-b border-gray-200 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-gray-800 font-medium">{item.name} × {item.quantity}</div>
                          {item.selectedOption && (
                            <div className="text-sm text-gray-600 mt-1">內容：{item.selectedOption}</div>
                          )}
                          {item.coverStyle && (
                            <div className="text-sm text-gray-500 mt-1">封面：{item.coverStyle}</div>
                          )}
                        </div>
                        <span className="font-medium text-gray-800">NT$ {item.price * item.quantity}</span>
                      </div>
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

          {/* 成分與過敏原資訊區 */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-light text-gray-800 mb-4">成分與過敏原資訊</h3>
              <div className="w-16 h-0.5 bg-amber-400 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 好日子蛋黃酥 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    <img 
                      src="/egg_single.jpg" 
                      alt="好日子蛋黃酥 (蛋奶素)"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800">好日子蛋黃酥 (蛋奶素)</h4>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">淨重：</span>
                    <span className="text-gray-600">75g</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">成分：</span>
                    <p className="text-gray-600 leading-relaxed mt-1">烏豆沙餡〔圓雲豆、蔗糖、麥芽糖、台灣19號奶油、大豆油、甜味劑(赤藻醣醇)、海藻糖、麥芽糊精、玫瑰鹽、黏稠劑(玉米糖膠)〕、嘉禾中筋粉心粉、低筋麵粉、台灣19號無水奶油、玄米油、鹹蛋黃（含花生油）、砂糖、水、蛋黃、黑芝麻</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <span className="font-medium text-red-700">過敏原：</span>
                    <p className="text-red-600 text-xs leading-relaxed mt-1">本產品含有蛋類、奶類、芝麻、大豆、小麥、花生及其製品，不適合其過敏體質者食用。</p>
                  </div>
                  <div className="mt-3">
                    <span className="font-medium text-gray-700 block mb-2">營養標示：</span>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <img 
                        src="/in_egg.jpg" 
                        alt="營養標示"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 好日子綠豆椪 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    <img 
                      src="/single.jpg" 
                      alt="好日子綠豆椪 (蛋奶素)"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800">好日子綠豆椪 (蛋奶素)</h4>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">淨重：</span>
                    <span className="text-gray-600">70g</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">成分：</span>
                    <p className="text-gray-600 leading-relaxed mt-1">綠豆沙（綠豆、砂糖、食用油、鹽）、嘉禾中筋粉心粉、低筋麵粉、台灣19號無水奶油、玄米油、砂糖、水</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <span className="font-medium text-red-700">過敏原：</span>
                    <p className="text-red-600 text-xs leading-relaxed mt-1">本產品含有奶類、小麥及其製品，不適合其過敏體質者食用。</p>
                  </div>
                  <div className="mt-3">
                    <span className="font-medium text-gray-700 block mb-2">營養標示：</span>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <img 
                        src="/in_02.jpg" 
                        alt="營養標示"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 輕日子檸檬磅蛋糕 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    <img 
                      src="/S__40509583.jpg" 
                      alt="輕日子檸檬磅蛋糕 (蛋奶素)"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800">輕日子檸檬磅蛋糕 (蛋奶素)</h4>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">淨重：</span>
                    <span className="text-gray-600">35g</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">成分：</span>
                    <p className="text-gray-600 leading-relaxed mt-1">台灣19號無鹽發酵奶油（乳脂、發酵菌種）、雞蛋、低筋麵粉、糖粉（砂糖、玉米澱粉）、細砂糖、檸檬汁、牛奶、鹽</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <span className="font-medium text-red-700">過敏原：</span>
                    <p className="text-red-600 text-xs leading-relaxed mt-1">本產品含有蛋類、奶類、小麥及其製品，不適合其過敏體質者食用。</p>
                  </div>
                  <div className="mt-3">
                    <span className="font-medium text-gray-700 block mb-2">營養標示：</span>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <img 
                        src="/in_03.jpg" 
                        alt="營養標示"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-amber-50 via-white to-amber-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-800 mb-4">聯絡方式</h2>
            <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              有任何問題或需要協助，<br />歡迎透過以下方式與我們聯繫
            </p>
          </div>
        
          {/* Social Media Links */}
          <div className="col-span-full flex justify-center items-center gap-8 mt-8 pt-8 border-t border-gray-200">
            <a 
              href="https://www.facebook.com/michikodessert/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <Facebook className="w-6 h-6" />
              <span className="text-sm">michiko咪匠人好食</span>
            </a>
            <a 
              href="https://www.instagram.com/michiko_dessert/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
            >
              <Instagram className="w-6 h-6" />
              <span className="text-sm">michiko咪匠人好食</span>
            </a>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-6 h-6" />
              <span className="text-sm">面交：台南市中西區</span>
            </div>
          </div>
        </div>
      </section>
    </div>

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
    </>
  );
}

// Product Card Component
function ProductCard({ product, onAddToCart }: {
  product: Product;
  onAddToCart: (product: Product, quantity: number, selectedOption?: string, coverStyle?: string) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(product.options?.[0] || '');
  const [coverStyle, setCoverStyle] = useState('');

  const coverOptions = ['哈欠狗', '厭世貓', '慵懶貓'];

  const handleAddToCart = () => {
    if (product.type === 'combo' && !selectedOption) {
      alert('請選擇商品組合');
      return;
    }
    onAddToCart(product, quantity, selectedOption, coverStyle || '隨機出貨');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
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
        <div className="text-gray-600 text-sm leading-relaxed mb-4">{product.description}</div>
        
        {/* 組合選項 */}
        {product.type === 'combo' && product.options && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選擇組合 *
            </label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            >
              {product.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 封面款式選擇 (僅組合商品) */}
        {product.type === 'combo' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              封面款式 (可選)
            </label>
            <select
              value={coverStyle}
              onChange={(e) => setCoverStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            >
              <option value="">隨機出貨</option>
              {coverOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

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
        
        {/* 統一加註說明 */}
        {product.type === 'combo' && (
          <p className="text-xs text-gray-500 mb-4 text-center">
            若未備註封面款式，將隨機出貨
          </p>
        )}
        
        <button
          disabled
          className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg cursor-not-allowed font-medium"
        >
          中秋已截單
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
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    {item.selectedOption && (
                      <p className="text-xs text-gray-600">內容：{item.selectedOption}</p>
                    )}
                    {item.coverStyle && (
                      <p className="text-xs text-gray-500">封面：{item.coverStyle}</p>
                    )}
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
    customerEmail: '',
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
            <div className="space-y-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  電子信箱 *
                </label>
                <input
  type="email"
  required
  value={formData.customerEmail}
  onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
  placeholder="example@email.com"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
/>
                <p className="text-xs text-gray-500 mt-1">
                  💡 我們會將匯款資訊發送至此信箱
                </p>
              </div>
            </div>
          </div>

          {/* 訂購品項 */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-gray-800 mb-4">訂購品項</h3>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={`${item.id}-${item.selectedOption}-${item.coverStyle}`} className="py-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-gray-800 font-medium">{item.name} × {item.quantity}</div>
                      {item.selectedOption && (
                        <div className="text-sm text-gray-600 mt-1">內容：{item.selectedOption}</div>
                      )}
                      {item.coverStyle && (
                        <div className="text-sm text-gray-500 mt-1">封面：{item.coverStyle}</div>
                      )}
                    </div>
                    <span className="font-medium text-gray-800">NT$ {item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 出貨時間 */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-gray-800 mb-4">出貨時間</h3>
            <div className="space-y-2">
              {['第一時段：9/8(一)依序出貨', '第二時段：9/15(一)依序出貨', '第三時段：9/22(一)依序出貨', '第四時段：9/30-10/02 僅接受台南市面交'].map(time => (
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
  onClick={(e) => {
    // 檢查是否已經在提交中
    if (window.isSubmitting) {
      e.preventDefault();
      return;
    }
    window.isSubmitting = true;
    e.target.style.backgroundColor = '#6b7280';
    e.target.style.cursor = 'not-allowed';
    e.target.textContent = '送出中，請耐心等待';
  }}
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