import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import PaymentProcessor from '@/components/PaymentProcessor';

export default function Index() {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [referralCode, setReferralCode] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const plans = [
    {
      id: 'starter',
      name: 'Стартовый',
      minAmount: 500,
      maxAmount: 5000,
      dailyReturn: 50,
      duration: 3,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      features: ['Выплаты от 24 часов', 'Техподдержка', 'Базовая статистика']
    },
    {
      id: 'standard',
      name: 'Стандарт',
      minAmount: 1000,
      maxAmount: 25000,
      dailyReturn: 50,
      duration: 3,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      features: ['Выплаты от 24 часов', 'Приоритетная поддержка', 'Расширенная статистика', 'Реферальные бонусы']
    },
    {
      id: 'premium',
      name: 'Премиум',
      minAmount: 5000,
      maxAmount: 100000,
      dailyReturn: 50,
      duration: 3,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      features: ['Выплаты от 24 часов', 'VIP поддержка', 'Персональный менеджер', 'Максимальные реферальные бонусы', 'Эксклюзивные отчеты']
    }
  ];

  const calculateReturn = (amount: number, plan: typeof plans[0]) => {
    const dailyProfit = (amount * plan.dailyReturn) / 100;
    const totalProfit = dailyProfit * plan.duration;
    return {
      daily: dailyProfit,
      total: totalProfit,
      final: amount + totalProfit
    };
  };

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1];
  const returns = calculateReturn(investmentAmount, currentPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">InvestPro</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#plans" className="text-gray-700 hover:text-indigo-600 transition-colors">Тарифы</a>
              <a href="#calculator" className="text-gray-700 hover:text-indigo-600 transition-colors">Калькулятор</a>
              <a href="#referral" className="text-gray-700 hover:text-indigo-600 transition-colors">Реферальная программа</a>
            </nav>
            <Button variant="outline" className="hidden md:flex">
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-indigo-100 text-indigo-700">
              🚀 Надежные инвестиции с гарантированным доходом
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Ваши деньги работают
              <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent block">
                на вас 24/7
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Профессиональное управление капиталом с ежедневными выплатами. 
              Начните инвестировать уже сегодня и получайте стабильный доход.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                    <Icon name="Play" size={20} className="mr-2" />
                    Начать инвестировать
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
                  <PaymentProcessor 
                    selectedPlan={currentPlan}
                    amount={investmentAmount}
                    onClose={() => setShowCheckout(false)}
                    onSuccess={(paymentData) => {
                      console.log('Оплата успешна:', paymentData);
                      setShowCheckout(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
              <Button size="lg" variant="outline">
                <Icon name="BarChart3" size={20} className="mr-2" />
                Посмотреть статистику
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section id="plans" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Инвестиционные планы
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Выберите подходящий тарифный план в зависимости от ваших финансовых возможностей
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${selectedPlan === plan.id ? 'ring-2 ring-indigo-500' : ''}`}>
                <div className={`h-2 ${plan.color}`} />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    {plan.id === 'standard' && (
                      <Badge className="bg-indigo-100 text-indigo-700">Популярный</Badge>
                    )}
                  </div>
                  <CardDescription className="text-lg">
                    {plan.minAmount.toLocaleString()} - {plan.maxAmount.toLocaleString()} ₽
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {plan.dailyReturn}%
                      </div>
                      <div className="text-sm text-gray-600">за {plan.duration} рабочих дня</div>
                    </div>
                    
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Icon name="Check" size={16} className="text-emerald-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className={`w-full ${plan.color} text-white hover:opacity-90`}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          <Icon name="CreditCard" size={16} className="mr-2" />
                          Инвестировать
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
                        <PaymentProcessor 
                          selectedPlan={plan}
                          amount={investmentAmount >= plan.minAmount && investmentAmount <= plan.maxAmount ? investmentAmount : plan.minAmount}
                          onClose={() => setShowCheckout(false)}
                          onSuccess={(paymentData) => {
                            console.log('Оплата успешна:', paymentData);
                            setShowCheckout(false);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-emerald-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Калькулятор доходности
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Рассчитайте потенциальную прибыль от ваших инвестиций
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Сумма инвестиций (₽)
                    </label>
                    <Input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="text-lg"
                      min={currentPlan.minAmount}
                      max={currentPlan.maxAmount}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Минимум: {currentPlan.minAmount.toLocaleString()} ₽ | 
                      Максимум: {currentPlan.maxAmount.toLocaleString()} ₽
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Выберите план
                    </label>
                    <Tabs value={selectedPlan} onValueChange={setSelectedPlan}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="starter">Стартовый</TabsTrigger>
                        <TabsTrigger value="standard">Стандарт</TabsTrigger>
                        <TabsTrigger value="premium">Премиум</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg p-6 text-white">
                  <h4 className="text-xl font-semibold mb-4">Прогноз доходности</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Ежедневный доход:</span>
                      <span className="font-bold text-xl">+{returns.daily.toFixed(0)} ₽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Общая прибыль:</span>
                      <span className="font-bold text-xl">+{returns.total.toFixed(0)} ₽</span>
                    </div>
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex justify-between items-center">
                        <span>Итого к выплате:</span>
                        <span className="font-bold text-2xl text-emerald-200">
                          {returns.final.toFixed(0)} ₽
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-emerald-200">
                      Период: {currentPlan.duration} рабочих дня
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Referral Program */}
      <section id="referral" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Реферальная программа
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Приглашайте друзей и получайте дополнительный доход с каждого вклада
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="UserPlus" size={32} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">1-й уровень</h4>
                <p className="text-3xl font-bold text-orange-600 mb-2">5%</p>
                <p className="text-gray-600">С каждого вклада ваших рефералов</p>
              </Card>
              
              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" size={32} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">2-й уровень</h4>
                <p className="text-3xl font-bold text-indigo-600 mb-2">2%</p>
                <p className="text-gray-600">С вкладов рефералов ваших рефералов</p>
              </Card>
              
              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Crown" size={32} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">3-й уровень</h4>
                <p className="text-3xl font-bold text-emerald-600 mb-2">1%</p>
                <p className="text-gray-600">С вкладов рефералов 2-го уровня</p>
              </Card>
            </div>
            
            <Card className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-2xl font-semibold mb-4">Ваша реферальная ссылка</h4>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <code className="text-sm">https://investpro.com/ref/YOUR_CODE</code>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1" variant="outline">
                      <Icon name="Copy" size={16} className="mr-2" />
                      Копировать ссылку
                    </Button>
                    <Button className="flex-1" variant="outline">
                      <Icon name="Share" size={16} className="mr-2" />
                      Поделиться
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-2xl font-semibold mb-4">Статистика</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Приглашено рефералов:</span>
                      <span className="font-bold">0</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Общий доход:</span>
                      <span className="font-bold text-emerald-600">0 ₽</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Доход за месяц:</span>
                      <span className="font-bold text-indigo-600">0 ₽</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">InvestPro</h3>
              </div>
              <p className="text-gray-400">
                Профессиональная инвестиционная платформа с гарантированным доходом.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Команда</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Карьера</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Новости</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Помощь</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Чат</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Правовая информация</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Условия использования</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Лицензия</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InvestPro. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}