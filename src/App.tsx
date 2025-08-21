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
                <p>我媽常說：「要做自己也敢吃的，才算對。」<br />所以你吃到的每一份甜點，<br />不只是好吃，<br />更是我們對食材的堅持，與對品質的要求。</p>
              </div>