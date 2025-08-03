import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface Investment {
  id: number;
  plan: string;
  amount: number;
  startDate: string;
  endDate: string;
  dailyReturn: number;
  totalReturn: number;
  status: 'active' | 'completed';
  daysLeft: number;
}

interface Investor {
  name: string;
  totalInvested: number;
  activeInvestments: Investment[];
}

export default function InvestorDashboard() {
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [investorCode, setInvestorCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Загружаем данные инвестора из localStorage
    const savedInvestor = localStorage.getItem('currentInvestor');
    const savedCode = localStorage.getItem('investorCode');
    
    if (savedInvestor && savedCode) {
      setInvestor(JSON.parse(savedInvestor));
      setInvestorCode(savedCode);
    } else {
      // Если нет данных, перенаправляем на вход
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentInvestor');
    localStorage.removeItem('investorCode');
    navigate('/');
  };

  const getTotalProfit = () => {
    if (!investor) return 0;
    return investor.activeInvestments.reduce((total, inv) => {
      const dailyProfit = (inv.amount * inv.dailyReturn) / 100;
      const completedDays = 3 - inv.daysLeft; // 3 дня - общий период
      return total + (dailyProfit * completedDays);
    }, 0);
  };

  const getTotalExpectedReturn = () => {
    if (!investor) return 0;
    return investor.activeInvestments.reduce((total, inv) => total + inv.totalReturn, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Стартовый': return 'bg-gradient-to-r from-orange-500 to-orange-600';
      case 'Стандарт': return 'bg-gradient-to-r from-indigo-500 to-indigo-600';
      case 'Премиум': return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  if (!investor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Загружаем ваши инвестиции...</p>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                Код: {investorCode}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать, {investor.name}! 👋
          </h2>
          <p className="text-gray-600">
            Здесь вы можете отслеживать все ваши активные инвестиции
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Общий депозит</p>
                  <p className="text-2xl font-bold">{investor.totalInvested.toLocaleString()} ₽</p>
                </div>
                <Icon name="Wallet" size={32} className="text-indigo-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Текущая прибыль</p>
                  <p className="text-2xl font-bold">+{getTotalProfit().toLocaleString()} ₽</p>
                </div>
                <Icon name="TrendingUp" size={32} className="text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Ожидаемый доход</p>
                  <p className="text-2xl font-bold">{getTotalExpectedReturn().toLocaleString()} ₽</p>
                </div>
                <Icon name="Target" size={32} className="text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Активных вкладов</p>
                  <p className="text-2xl font-bold">{investor.activeInvestments.length}</p>
                </div>
                <Icon name="BarChart3" size={32} className="text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Investments */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Активные инвестиции</h3>
          
          {investor.activeInvestments.map((investment) => {
            const progressPercentage = ((3 - investment.daysLeft) / 3) * 100;
            const dailyProfit = (investment.amount * investment.dailyReturn) / 100;
            
            return (
              <Card key={investment.id} className="overflow-hidden">
                <div className={`h-2 ${getPlanColor(investment.plan)}`} />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Тариф "{investment.plan}"</CardTitle>
                      <CardDescription>
                        Депозит: {investment.amount.toLocaleString()} ₽
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(investment.status)}>
                      {investment.status === 'active' ? 'Активен' : 'Завершен'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Прогресс</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <p className="text-xs text-gray-600">
                        Осталось: {investment.daysLeft} дн.
                      </p>
                    </div>

                    {/* Daily Profit */}
                    <div>
                      <p className="text-sm text-gray-600">Ежедневный доход</p>
                      <p className="text-xl font-bold text-emerald-600">
                        +{dailyProfit.toLocaleString()} ₽
                      </p>
                      <p className="text-xs text-gray-500">{investment.dailyReturn}% в день</p>
                    </div>

                    {/* Total Return */}
                    <div>
                      <p className="text-sm text-gray-600">Итого к выплате</p>
                      <p className="text-xl font-bold text-indigo-600">
                        {investment.totalReturn.toLocaleString()} ₽
                      </p>
                      <p className="text-xs text-gray-500">
                        Прибыль: +{(investment.totalReturn - investment.amount).toLocaleString()} ₽
                      </p>
                    </div>

                    {/* Dates */}
                    <div>
                      <p className="text-sm text-gray-600">Период</p>
                      <p className="text-sm font-medium">
                        {formatDate(investment.startDate)}
                      </p>
                      <p className="text-sm font-medium">
                        {formatDate(investment.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://t.me/invest_officiall', '_blank')}
                    >
                      <Icon name="MessageCircle" size={16} className="mr-2" />
                      Связаться с менеджером
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Icon name="Download" size={16} className="mr-2" />
                      Скачать отчет
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Icon name="PlusCircle" size={48} className="mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Хотите увеличить доход?</h3>
              <p className="text-gray-600 mb-6">
                Создайте новую инвестицию для получения дополнительной прибыли
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                >
                  <Icon name="TrendingUp" size={16} className="mr-2" />
                  Новая инвестиция
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://t.me/invest_officiall', '_blank')}
                >
                  <Icon name="MessageCircle" size={16} className="mr-2" />
                  Консультация
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}