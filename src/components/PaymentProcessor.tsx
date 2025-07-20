import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface PaymentProcessorProps {
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
  onSuccess?: (paymentData: any) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  handler: string;
  testCard?: string;
}

export default function PaymentProcessor({ selectedPlan, amount, onClose, onSuccess }: PaymentProcessorProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('yookassa');
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'payment' | 'success'>('form');
  const [paymentUrl, setPaymentUrl] = useState('');
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'yookassa',
      name: 'ЮKassa',
      icon: 'CreditCard',
      description: 'Карты, Apple Pay, Google Pay',
      handler: 'yookassa',
      testCard: '4111 1111 1111 1111'
    },
    {
      id: 'sberbank',
      name: 'СберБанк Онлайн',
      icon: 'Building2',
      description: 'Переход в СберБанк Онлайн',
      handler: 'sberbank'
    },
    {
      id: 'tinkoff',
      name: 'Тинькофф',
      icon: 'Wallet',
      description: 'Мгновенная оплата',
      handler: 'tinkoff'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'Globe',
      description: 'Международные платежи',
      handler: 'paypal'
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

  const processPayment = async () => {
    if (!contactInfo.email || !contactInfo.phone || !contactInfo.name) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Симуляция создания платежа
      await new Promise(resolve => setTimeout(resolve, 2000));

      const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
      
      if (selectedMethod?.handler === 'yookassa') {
        // Симуляция ЮKassa
        const mockPaymentUrl = `https://yoomoney.ru/checkout/payments/v2/contract?orderId=test_${Date.now()}`;
        setPaymentUrl(mockPaymentUrl);
        setPaymentStep('payment');
        
        // Симуляция успешной оплаты через 5 секунд
        setTimeout(() => {
          setPaymentStep('success');
          toast({
            title: "Оплата успешна! 🎉",
            description: `Инвестиция ${amount.toLocaleString()} ₽ оформлена. Выплаты начнутся через 24 часа.`,
          });
          onSuccess?.({
            amount,
            plan: selectedPlan,
            paymentMethod: selectedMethod,
            transactionId: `tx_${Date.now()}`
          });
        }, 5000);
      } else {
        // Для других платежных систем
        setPaymentStep('success');
        toast({
          title: "Платеж обрабатывается",
          description: `Переход к оплате через ${selectedMethod?.name}`,
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка оплаты",
        description: "Попробуйте другой способ оплаты",
        variant: "destructive"
      });
      setPaymentStep('form');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  if (paymentStep === 'processing') {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Icon name="Loader2" size={48} className="mx-auto text-indigo-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Создание платежа...</h3>
            <p className="text-gray-600">Подготавливаем безопасную форму оплаты</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'payment') {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Card>
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-emerald-500 text-white">
            <CardTitle className="text-2xl">Оплата через ЮKassa</CardTitle>
            <CardDescription className="text-indigo-100">
              Сумма: {amount.toLocaleString()} ₽ | План: {selectedPlan.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg">
                <Icon name="CreditCard" size={48} className="mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Демо-режим оплаты</h3>
                <p className="text-gray-600 mb-4">
                  В реальном проекте здесь будет форма ЮKassa
                </p>
                <div className="bg-white p-4 rounded border-2 border-dashed border-gray-300">
                  <p className="text-sm text-gray-500 mb-2">Тестовая карта:</p>
                  <code className="text-lg font-mono">4111 1111 1111 1111</code>
                  <p className="text-xs text-gray-400 mt-2">CVV: 123, Срок: 12/25</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Icon name="Loader2" size={20} className="animate-spin" />
                <span>Обработка платежа...</span>
              </div>
              
              <p className="text-sm text-gray-500">
                Автоматическое перенаправление через 5 секунд...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Check" size={32} className="text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Оплата успешна!</h3>
            <p className="text-gray-600 mb-6">
              Ваша инвестиция в размере {amount.toLocaleString()} ₽ оформлена
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>План:</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Сумма:</span>
                  <span className="font-medium">{amount.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Ожидаемая прибыль:</span>
                  <span className="font-medium text-green-600">+{returns.total.toFixed(0)} ₽</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={onClose}
                className="w-full"
              >
                Закрыть
              </Button>
              <p className="text-xs text-gray-500">
                Выплаты начнутся через 24 часа. Проверьте email для получения деталей.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-emerald-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Автоматическая оплата</CardTitle>
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
            {/* Левая колонка - Форма */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Способ оплаты</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPaymentMethod === method.id 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleMethodSelect(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon name={method.icon as any} size={24} className="text-gray-600" />
                        <div className="flex-1">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                          {method.testCard && (
                            <div className="text-xs text-gray-400 mt-1">
                              Тест: {method.testCard}
                            </div>
                          )}
                        </div>
                        {selectedPaymentMethod === method.id && (
                          <Icon name="Check" size={20} className="text-indigo-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Контактная информация</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Имя *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ваше имя"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.ru"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка - Сводка */}
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
                    <Icon name="Shield" size={16} className="text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Безопасность:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• SSL шифрование данных</li>
                        <li>• Защищенные платежи</li>
                        <li>• Мгновенное подтверждение</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={processPayment}
                disabled={isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-lg py-6"
              >
                {isProcessing ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Создание платежа...
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" size={20} className="mr-2" />
                    Оплатить {amount.toLocaleString()} ₽
                  </>
                )}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Безопасная оплата. Средства поступят на ваш счет через 24 часа.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}