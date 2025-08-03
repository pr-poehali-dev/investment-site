import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface GeneratedInvestor {
  code: string;
  name: string;
  plan: string;
  amount: number;
  telegram: string;
  createdAt: string;
}

export default function CodeGenerator() {
  const [clientName, setClientName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const { toast } = useToast();

  const plans = [
    { id: 'starter', name: 'Стартовый', minAmount: 500, maxAmount: 5000 },
    { id: 'standard', name: 'Стандарт', minAmount: 1000, maxAmount: 25000 },
    { id: 'premium', name: 'Премиум', minAmount: 5000, maxAmount: 100000 }
  ];

  const generateInvestorCode = () => {
    if (!clientName || !selectedPlan || !investmentAmount) {
      toast({
        title: "Заполните все поля",
        description: "Необходимо указать имя, тариф и сумму инвестиции",
        variant: "destructive",
      });
      return;
    }

    const amount = Number(investmentAmount);
    const plan = plans.find(p => p.id === selectedPlan);
    
    if (plan && (amount < plan.minAmount || amount > plan.maxAmount)) {
      toast({
        title: "Неверная сумма",
        description: `Для тарифа "${plan.name}" сумма должна быть от ${plan.minAmount.toLocaleString()} до ${plan.maxAmount.toLocaleString()} ₽`,
        variant: "destructive",
      });
      return;
    }

    // Генерируем уникальный код
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    const code = `INV${timestamp}${randomNum}`.slice(0, 10);

    setGeneratedCode(code);

    // Создаем данные инвестора
    const investorData = {
      code,
      name: clientName,
      plan: plans.find(p => p.id === selectedPlan)?.name || '',
      amount,
      telegram: telegramUsername,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +3 дня
      dailyReturn: 50,
      totalReturn: amount + (amount * 50 / 100), // 50% за 3 дня
      status: 'active',
      daysLeft: 3
    };

    // Сохраняем в localStorage (в реальности будет база данных)
    const existingCodes = JSON.parse(localStorage.getItem('generatedCodes') || '{}');
    existingCodes[code] = investorData;
    localStorage.setItem('generatedCodes', JSON.stringify(existingCodes));

    // Также добавляем в демо-данные для входа
    const demoInvestors = JSON.parse(localStorage.getItem('demoInvestors') || '{}');
    demoInvestors[code] = {
      name: clientName,
      totalInvested: amount,
      activeInvestments: [{
        id: Date.now(),
        plan: investorData.plan,
        amount: investorData.amount,
        startDate: investorData.startDate,
        endDate: investorData.endDate,
        dailyReturn: investorData.dailyReturn,
        totalReturn: investorData.totalReturn,
        status: investorData.status,
        daysLeft: investorData.daysLeft
      }]
    };
    localStorage.setItem('demoInvestors', JSON.stringify(demoInvestors));

    toast({
      title: "Код успешно создан! 🎉",
      description: `Код инвестора: ${code}`,
    });
  };

  const copyCodeToClipboard = () => {
    if (!generatedCode) return;

    const plan = plans.find(p => p.id === selectedPlan);
    const messageText = `🎉 Ваша инвестиция успешно активирована!

👤 Инвестор: ${clientName}
💼 Тариф: ${plan?.name}
💰 Сумма: ${Number(investmentAmount).toLocaleString()} ₽
📈 Доходность: 50% за 3 рабочих дня
💵 К выплате: ${(Number(investmentAmount) + Number(investmentAmount) * 0.5).toLocaleString()} ₽

🔑 Ваш код доступа: ${generatedCode}

📱 Войдите в личный кабинет на сайте:
Используйте кнопку "Вход инвестора" и введите ваш код.

📊 В личном кабинете вы сможете:
• Отслеживать прогресс инвестиции
• Видеть ежедневные начисления
• Связываться с менеджером
• Скачивать отчеты

Спасибо за доверие! 🚀`;

    navigator.clipboard.writeText(messageText).then(() => {
      setCopyMessage('Сообщение скопировано! Отправьте его клиенту в Telegram');
      setTimeout(() => setCopyMessage(''), 3000);
    });
  };

  const resetForm = () => {
    setClientName('');
    setSelectedPlan('');
    setInvestmentAmount('');
    setTelegramUsername('');
    setGeneratedCode('');
    setCopyMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Генератор кодов</h1>
          </div>
          <p className="text-gray-600">Создание доступа для новых инвесторов</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Данные клиента</CardTitle>
              <CardDescription>
                Заполните информацию о новом инвесторе
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Имя клиента</Label>
                <Input
                  id="name"
                  placeholder="Иван Петров"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram username (опционально)</Label>
                <Input
                  id="telegram"
                  placeholder="@username"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Тарифный план</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тариф" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} ({plan.minAmount.toLocaleString()} - {plan.maxAmount.toLocaleString()} ₽)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Сумма инвестиции (₽)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10000"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
                {selectedPlan && (
                  <p className="text-sm text-gray-500">
                    Лимиты: {plans.find(p => p.id === selectedPlan)?.minAmount.toLocaleString()} - {plans.find(p => p.id === selectedPlan)?.maxAmount.toLocaleString()} ₽
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={generateInvestorCode}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700"
                >
                  <Icon name="Zap" size={16} className="mr-2" />
                  Создать код
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <Icon name="RotateCcw" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          <Card>
            <CardHeader>
              <CardTitle>Результат</CardTitle>
              <CardDescription>
                Отправьте это сообщение клиенту
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedCode ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-emerald-800">Код инвестора</span>
                      <Badge className="bg-emerald-100 text-emerald-700">{generatedCode}</Badge>
                    </div>
                    <p className="text-sm text-emerald-700">
                      Код успешно создан и сохранен в системе
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Сообщение для клиента</Label>
                    <Textarea
                      readOnly
                      value={`🎉 Ваша инвестиция успешно активирована!

👤 Инвестор: ${clientName}
💼 Тариф: ${plans.find(p => p.id === selectedPlan)?.name}
💰 Сумма: ${Number(investmentAmount).toLocaleString()} ₽
📈 Доходность: 50% за 3 рабочих дня
💵 К выплате: ${(Number(investmentAmount) + Number(investmentAmount) * 0.5).toLocaleString()} ₽

🔑 Ваш код доступа: ${generatedCode}

📱 Войдите в личный кабинет на сайте:
Используйте кнопку "Вход инвестора" и введите ваш код.

📊 В личном кабинете вы сможете:
• Отслеживать прогресс инвестиции
• Видеть ежедневные начисления
• Связываться с менеджером
• Скачивать отчеты

Спасибо за доверие! 🚀`}
                      className="min-h-[200px] text-sm"
                    />
                  </div>

                  <Button
                    onClick={copyCodeToClipboard}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700"
                  >
                    <Icon name="Copy" size={16} className="mr-2" />
                    Скопировать сообщение
                  </Button>

                  {copyMessage && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">{copyMessage}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>Заполните форму и нажмите "Создать код"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📋 Инструкция по работе</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">1</div>
                <h4 className="font-semibold">Получение заявки</h4>
                <p className="text-sm text-gray-600">
                  Клиент пишет вам в Telegram с заявкой на инвестицию
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">2</div>
                <h4 className="font-semibold">Создание кода</h4>
                <p className="text-sm text-gray-600">
                  После получения оплаты создайте код доступа через эту форму
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">3</div>
                <h4 className="font-semibold">Отправка клиенту</h4>
                <p className="text-sm text-gray-600">
                  Скопируйте готовое сообщение и отправьте его в Telegram
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}