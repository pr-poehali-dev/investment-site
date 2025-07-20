import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  fee?: string;
}

interface PaymentCheckoutProps {
  selectedPlan: {
    id: string;
    name: string;
    minAmount: number;
    maxAmount: number;
    dailyReturn: number;
    duration: number;
    color: string;
  };
  amount: number;
  onClose?: () => void;
}

export default function PaymentCheckout({ selectedPlan, amount, onClose }: PaymentCheckoutProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('sberbank');
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    telegramUsername: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'sberbank',
      name: 'СберБанк',
      icon: 'CreditCard',
      description: 'Банковская карта, СБП'
    },
    {
      id: 'yookassa',
      name: 'ЮKassa',
      icon: 'Wallet',
      description: 'Карты, электронные кошельки'
    },
    {
      id: 'tinkoff',
      name: 'Тинькофф',
      icon: 'Building2',
      description: 'Мгновенные переводы'
    },
    {
      id: 'crypto',
      name: 'Криптовалюта',
      icon: 'Bitcoin',
      description: 'BTC, ETH, USDT',
      fee: 'Без комиссии'
    }
  ];

  const calculateReturns = () => {
    const dailyProfit = (amount * selectedPlan.dailyReturn) / 100;
    const totalProfit = dailyProfit * selectedPlan.duration;
    return {
      daily: dailyProfit,
      total: totalProfit,
      final: amount + totalProfit
    };
  };

  const returns = calculateReturns();

  const handlePayment = async () => {
    if (!contactInfo.email && !contactInfo.phone && !contactInfo.telegramUsername) {
      toast({
        title: "Ошибка",
        description: "Укажите хотя бы один способ связи",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Имитация обработки платежа
    setTimeout(() => {
      toast({
        title: "Заявка принята!",
        description: `Ваша заявка на инвестирование ${amount.toLocaleString()} ₽ принята. Мы свяжемся с вами в течение 30 минут.`,
      });
      setIsProcessing(false);
      onClose?.();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-emerald-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Оформление инвестиции</CardTitle>
              <CardDescription className="text-indigo-100">
                План: {selectedPlan.name} | Сумма: {amount.toLocaleString()} ₽
              </CardDescription>
            </div>
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <Icon name="X" size={20} />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Левая колонка - Форма оплаты */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Способ оплаты</h3>
                <RadioGroup 
                  value={selectedPaymentMethod} 
                  onValueChange={setSelectedPaymentMethod}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Icon name={method.icon as any} size={24} className="text-gray-600" />
                      <div className="flex-1">
                        <Label htmlFor={method.id} className="cursor-pointer font-medium">
                          {method.name}
                        </Label>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      {method.fee && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {method.fee}
                        </Badge>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Контактная информация</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.ru"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telegram">Telegram (необязательно)</Label>
                    <Input
                      id="telegram"
                      type="text"
                      placeholder="@username"
                      value={contactInfo.telegramUsername}
                      onChange={(e) => setContactInfo({...contactInfo, telegramUsername: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка - Детали инвестиции */}
            <div>
              <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Детали инвестиции</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Инвестиционный план:</span>
                    <span className="font-medium">{selectedPlan.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Сумма инвестиции:</span>
                    <span className="font-bold">{amount.toLocaleString()} ₽</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Период:</span>
                    <span className="font-medium">{selectedPlan.duration} рабочих дня</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Доходность:</span>
                    <span className="font-medium">{selectedPlan.dailyReturn}%</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ежедневный доход:</span>
                      <span className="font-medium text-emerald-600">+{returns.daily.toFixed(0)} ₽</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Общая прибыль:</span>
                      <span className="font-medium text-emerald-600">+{returns.total.toFixed(0)} ₽</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">Итого к выплате:</span>
                      <span className="font-bold text-xl text-emerald-600">
                        {returns.final.toFixed(0)} ₽
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Важная информация:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Выплаты начинаются через 24 часа</li>
                        <li>• Капитал возвращается в конце срока</li>
                        <li>• Техподдержка 24/7</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-lg py-6"
              >
                {isProcessing ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Обработка заявки...
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" size={20} className="mr-2" />
                    Отправить заявку на {amount.toLocaleString()} ₽
                  </>
                )}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Нажимая кнопку, вы соглашаетесь с условиями использования и политикой конфиденциальности
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}