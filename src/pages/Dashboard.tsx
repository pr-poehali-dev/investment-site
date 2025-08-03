import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'profit';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  date: string;
  method?: string;
  plan?: string;
  description: string;
}

interface Investment {
  id: string;
  plan: string;
  amount: number;
  dailyReturn: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
  earnedProfit: number;
  totalProfit: number;
}

export default function Dashboard() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('sberbank');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const { toast } = useToast();

  // Мок данные для демонстрации
  const userData = {
    name: 'Иван Петров',
    email: 'ivan@example.com',
    balance: 15750,
    totalInvested: 50000,
    totalEarned: 8250,
    activeInvestments: 3
  };

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      amount: 10000,
      status: 'completed',
      date: '2024-07-18',
      method: 'ЮKassa',
      plan: 'Стандарт',
      description: 'Пополнение через ЮKassa'
    },
    {
      id: '2',
      type: 'profit',
      amount: 500,
      status: 'completed',
      date: '2024-07-19',
      description: 'Дневная прибыль (План: Стандарт)'
    },
    {
      id: '3',
      type: 'withdrawal',
      amount: 2500,
      status: 'completed',
      date: '2024-07-19',
      method: 'СберБанк',
      description: 'Вывод на карту СберБанк'
    },
    {
      id: '4',
      type: 'deposit',
      amount: 25000,
      status: 'completed',
      date: '2024-07-20',
      method: 'Тинькофф',
      plan: 'Премиум',
      description: 'Пополнение через Тинькофф'
    },
    {
      id: '5',
      type: 'profit',
      amount: 1250,
      status: 'completed',
      date: '2024-07-20',
      description: 'Дневная прибыль (План: Премиум)'
    },
    {
      id: '6',
      type: 'withdrawal',
      amount: 5000,
      status: 'pending',
      date: '2024-07-20',
      method: 'ЮMoney',
      description: 'Вывод на ЮMoney кошелек'
    }
  ];

  const investments: Investment[] = [
    {
      id: '1',
      plan: 'Стандарт',
      amount: 10000,
      dailyReturn: 50,
      duration: 3,
      startDate: '2024-07-18',
      endDate: '2024-07-21',
      status: 'active',
      earnedProfit: 1000,
      totalProfit: 1500
    },
    {
      id: '2',
      plan: 'Премиум',
      amount: 25000,
      dailyReturn: 50,
      duration: 3,
      startDate: '2024-07-20',
      endDate: '2024-07-23',
      status: 'active',
      earnedProfit: 1250,
      totalProfit: 3750
    },
    {
      id: '3',
      plan: 'Стартовый',
      amount: 5000,
      dailyReturn: 50,
      duration: 3,
      startDate: '2024-07-15',
      endDate: '2024-07-18',
      status: 'completed',
      earnedProfit: 750,
      totalProfit: 750
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return 'ArrowDownToLine';
      case 'withdrawal': return 'ArrowUpFromLine';
      case 'profit': return 'TrendingUp';
      default: return 'Circle';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-blue-600';
      case 'withdrawal': return 'text-orange-600';
      case 'profit': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Выполнено</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">В обработке</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Отклонено</Badge>;
      default:
        return <Badge variant="secondary">Неизвестно</Badge>;
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || !withdrawDetails) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount > userData.balance) {
      toast({
        title: "Недостаточно средств",
        description: `Доступно для вывода: ${userData.balance.toLocaleString()} ₽`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Заявка на вывод принята",
      description: `Заявка на вывод ${amount.toLocaleString()} ₽ отправлена на обработку`,
    });

    setWithdrawAmount('');
    setWithdrawDetails('');
  };

  const depositTransactions = transactions.filter(t => t.type === 'deposit');
  const withdrawalTransactions = transactions.filter(t => t.type === 'withdrawal');
  const profitTransactions = transactions.filter(t => t.type === 'profit');

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
            <nav className="flex items-center space-x-6">
              <a href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
                <Icon name="Home" size={20} />
              </a>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} />
                </div>
                <span className="text-sm font-medium">{userData.name}</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Доступный баланс</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {userData.balance.toLocaleString()} ₽
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Всего инвестировано</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {userData.totalInvested.toLocaleString()} ₽
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Всего заработано</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{userData.totalEarned.toLocaleString()} ₽
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Активных инвестиций</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {userData.activeInvestments}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная панель */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="transactions" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="transactions">Все операции</TabsTrigger>
                <TabsTrigger value="deposits">Пополнения</TabsTrigger>
                <TabsTrigger value="withdrawals">Выводы</TabsTrigger>
                <TabsTrigger value="investments">Инвестиции</TabsTrigger>
              </TabsList>

              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>История операций</CardTitle>
                    <CardDescription>Все ваши финансовые операции</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                              <Icon name={getTransactionIcon(transaction.type) as any} size={20} />
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(transaction.date).toLocaleDateString('ru-RU')}
                                {transaction.method && ` • ${transaction.method}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                              {transaction.type === 'withdrawal' ? '-' : '+'}
                              {transaction.amount.toLocaleString()} ₽
                            </p>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deposits">
                <Card>
                  <CardHeader>
                    <CardTitle>История пополнений</CardTitle>
                    <CardDescription>Все ваши пополнения счета</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {depositTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <Icon name="ArrowDownToLine" size={20} />
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(transaction.date).toLocaleDateString('ru-RU')} • {transaction.method}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">
                              +{transaction.amount.toLocaleString()} ₽
                            </p>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="withdrawals">
                <Card>
                  <CardHeader>
                    <CardTitle>История выводов</CardTitle>
                    <CardDescription>Все ваши выводы средств</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {withdrawalTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                              <Icon name="ArrowUpFromLine" size={20} />
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(transaction.date).toLocaleDateString('ru-RU')} • {transaction.method}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-orange-600">
                              -{transaction.amount.toLocaleString()} ₽
                            </p>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="investments">
                <Card>
                  <CardHeader>
                    <CardTitle>Мои инвестиции</CardTitle>
                    <CardDescription>Активные и завершенные инвестиции</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {investments.map((investment) => (
                        <div key={investment.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">План: {investment.plan}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(investment.startDate).toLocaleDateString('ru-RU')} - {new Date(investment.endDate).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                            <Badge className={investment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                              {investment.status === 'active' ? 'Активная' : 'Завершена'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Инвестировано</p>
                              <p className="font-semibold">{investment.amount.toLocaleString()} ₽</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Заработано</p>
                              <p className="font-semibold text-green-600">+{investment.earnedProfit.toLocaleString()} ₽</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Ожидаемая прибыль</p>
                              <p className="font-semibold">{investment.totalProfit.toLocaleString()} ₽</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Вывод средств */}
            <Card>
              <CardHeader>
                <CardTitle>Вывод средств</CardTitle>
                <CardDescription>Доступно: {userData.balance.toLocaleString()} ₽</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="withdraw-amount">Сумма для вывода</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="withdraw-method">Способ вывода</Label>
                  <select 
                    id="withdraw-method"
                    className="w-full p-2 border rounded-md"
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                  >
                    <option value="sberbank">СберБанк</option>
                    <option value="tinkoff">Тинькофф</option>
                    <option value="yumoney">ЮMoney</option>
                    <option value="qiwi">QIWI</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="withdraw-details">Номер карты/кошелька</Label>
                  <Input
                    id="withdraw-details"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={withdrawDetails}
                    onChange={(e) => setWithdrawDetails(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleWithdraw} className="w-full">
                  <Icon name="ArrowUpFromLine" size={16} className="mr-2" />
                  Заказать вывод
                </Button>
              </CardContent>
            </Card>

            {/* Быстрые действия */}
            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/admin/codes'}
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Создать код инвестора
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Users" size={16} className="mr-2" />
                  Пригласить друга
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="MessageCircle" size={16} className="mr-2" />
                  Техподдержка
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}