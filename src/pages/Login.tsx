import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [investorCode, setInvestorCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Демо-данные инвесторов (в реальности будет база данных)
  const demoInvestors = {
    'INV001': {
      name: 'Иван Петров',
      totalInvested: 25000,
      activeInvestments: [
        {
          id: 1,
          plan: 'Стандарт',
          amount: 15000,
          startDate: '2024-07-28',
          endDate: '2024-07-31',
          dailyReturn: 50,
          totalReturn: 22500,
          status: 'active',
          daysLeft: 1
        },
        {
          id: 2,
          plan: 'Премиум',
          amount: 10000,
          startDate: '2024-07-30',
          endDate: '2024-08-02',
          dailyReturn: 50,
          totalReturn: 15000,
          status: 'active',
          daysLeft: 3
        }
      ]
    },
    'INV002': {
      name: 'Мария Сидорова',
      totalInvested: 50000,
      activeInvestments: [
        {
          id: 3,
          plan: 'Премиум',
          amount: 50000,
          startDate: '2024-07-29',
          endDate: '2024-08-01',
          dailyReturn: 50,
          totalReturn: 75000,
          status: 'active',
          daysLeft: 2
        }
      ]
    }
  };

  const handleLogin = () => {
    setIsLoading(true);
    setError('');

    // Симуляция проверки кода
    setTimeout(() => {
      const investor = demoInvestors[investorCode as keyof typeof demoInvestors];
      
      if (investor) {
        // Сохраняем данные инвестора в localStorage
        localStorage.setItem('currentInvestor', JSON.stringify(investor));
        localStorage.setItem('investorCode', investorCode);
        navigate('/investor-dashboard');
      } else {
        setError('Неверный код инвестора. Проверьте правильность ввода.');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">InvestPro</h1>
          </div>
          <p className="text-gray-600">Войдите в личный кабинет инвестора</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Вход в кабинет</CardTitle>
            <CardDescription className="text-center">
              Введите ваш код инвестора, полученный после оплаты
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code">Код инвестора</Label>
              <Input
                id="code"
                type="text"
                placeholder="Например: INV001"
                value={investorCode}
                onChange={(e) => setInvestorCode(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono"
              />
              <p className="text-sm text-gray-500">
                Код был отправлен вам в Telegram после оплаты
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <Icon name="AlertCircle" size={16} />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleLogin}
              disabled={!investorCode || isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Проверяем код...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={20} className="mr-2" />
                  Войти
                </>
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Потеряли код? 
                <a 
                  href="https://t.me/invest_officiall" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 ml-1"
                >
                  Напишите в поддержку
                </a>
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Вернуться на главную
              </Button>
            </div>

            {/* Демо-коды для тестирования */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">🧪 Демо-коды для тестирования:</h4>
              <div className="space-y-1 text-sm text-yellow-700">
                <p><code className="bg-yellow-100 px-2 py-1 rounded">INV001</code> - Иван Петров (2 инвестиции)</p>
                <p><code className="bg-yellow-100 px-2 py-1 rounded">INV002</code> - Мария Сидорова (1 инвестиция)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}