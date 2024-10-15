import React, { useState, useRef } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Percent, Trash, DollarSign, Smartphone, Printer, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useReactToPrint } from 'react-to-print'
import { formatDistanceToNow, parseISO } from 'date-fns'
import html2canvas from 'html2canvas'

export default function CheckoutSection({ cart, updateCart, clearCart, handleCheckout }) {
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [discountType, setDiscountType] = useState('percentage')
  const [discountValue, setDiscountValue] = useState(0)
  const [isLoyaltyCustomer, setIsLoyaltyCustomer] = useState(false)
  const [amountPaid, setAmountPaid] = useState(0)
  const [changeAmount, setChangeAmount] = useState(0)
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)
  const [invoiceData, setInvoiceData] = useState(null)
  const invoiceRef = useRef()
  const [customerName, setCustomerName] = useState('Customer Name')
  const [customerAddress, setCustomerAddress] = useState('Customer Address')
  const [customerCityStateZip, setCustomerCityStateZip] = useState('Customer City, State ZIP')

  const updateQuantity = (productId, change) => {
    updateCart(cart.map(item => {
      if (item._id === productId) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const removeFromCart = (productId) => {
    updateCart(cart.filter(item => item._id !== productId))
    toast.info('Item removed from cart')
  }

  const updateItemDiscount = (productId, discount, discountType) => {
    updateCart(cart.map(item => 
      item._id === productId ? { ...item, discount, discountType } : item
    ))
  }

  const calculateItemDiscount = (item) => {
    return item.discountType === 'percentage' 
      ? item.price * item.quantity * (item.discount / 100)
      : Math.min(item.discount, item.price * item.quantity)
  }

  const calculateSubtotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const calculateTotalDiscount = () => {
    const itemDiscountsTotal = cart.reduce((total, item) => total + calculateItemDiscount(item), 0)
    const cartDiscount = discountType === 'percentage' 
      ? calculateSubtotal() * (discountValue / 100) 
      : Math.min(discountValue, calculateSubtotal())
    return itemDiscountsTotal + cartDiscount
  }
  const calculateTotal = () => {
    let total = calculateSubtotal() - calculateTotalDiscount()
    if (isLoyaltyCustomer) total *= 0.95
    return total.toFixed(2)
  }

  const handleAmountPaidChange = (e) => {
    const paid = parseFloat(e.target.value) || 0
    setAmountPaid(paid)
    const change = paid - parseFloat(calculateTotal())
    setChangeAmount(change > 0 ? change.toFixed(2) : 0)
  }

  const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`

  const handleCompletePurchase = () => {
    const invoiceData = {
      items: cart,
      subtotal: calculateSubtotal(),
      totalDiscount: calculateTotalDiscount(),
      total: calculateTotal(),
      paymentMethod,
      discountType,
      discountValue,
      isLoyaltyCustomer,
      amountPaid,
      changeAmount,
      date: new Date().toISOString(), // Use ISO string format
      invoiceNumber: `INV-${Date.now()}`,
      customerName,
      customerAddress,
      customerCityStateZip,
    }
    setInvoiceData(invoiceData)
    setShowInvoiceDialog(true)
  }

  const finalizeCheckout = () => {
    handleCheckout(paymentMethod, discountType, discountValue, isLoyaltyCustomer, calculateTotal(), amountPaid, changeAmount)
    closeInvoiceDialog()
  }

  const closeInvoiceDialog = () => {
    setShowInvoiceDialog(false)
    clearCart()
    setPaymentMethod('cash')
    setDiscountType('percentage')
    setDiscountValue(0)
    setIsLoyaltyCustomer(false)
    setAmountPaid(0)
    setChangeAmount(0)
    setInvoiceData(null)
  }

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  })

  const handleDownloadImage = async () => {
    const filename = `invoice-${invoiceData.invoiceNumber}.png`;
    try {
      const canvas = await html2canvas(invoiceRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = imgData;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Invoice downloaded as ${filename}`);
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate invoice image');
    }
  };

  const Invoice = React.forwardRef((props, ref) => {
    if (!props.data) {
      return <div ref={ref}>Loading invoice data...</div>;
    }

    const { data } = props;

    // Parse the date string into a Date object
    const invoiceDate = parseISO(data.date);

    return (
      <div ref={ref} className="p-8 bg-white text-gray-800 max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Invoice</h1>
            <p className="text-sm text-gray-600">Invoice Number: {data.invoiceNumber}</p>
            <p className="text-sm text-gray-600">Date: {data.date}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Company Name</h2>
            <p className="text-sm text-gray-600">123 Business Street</p>
            <p className="text-sm text-gray-600">City, State 12345</p>
            <p className="text-sm text-gray-600">Phone: (123) 456-7890</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
          <p className="text-sm text-gray-600">{data.customerName}</p>
          <p className="text-sm text-gray-600">{data.customerAddress}</p>
          <p className="text-sm text-gray-600">{data.customerCityStateZip}</p>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 font-semibold">Item</th>
              <th className="py-2 px-4 font-semibold text-right">Quantity</th>
              <th className="py-2 px-4 font-semibold text-right">Price</th>
              <th className="py-2 px-4 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4 text-right">{item.quantity}</td>
                <td className="py-2 px-4 text-right">{formatCurrency(item.price)}</td>
                <td className="py-2 px-4 text-right">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-1/2">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Subtotal:</span>
              <span>{formatCurrency(data.subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Discount:</span>
              <span className="text-red-600">-{formatCurrency(data.totalDiscount)}</span>
            </div>
            {data.isLoyaltyCustomer && (
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Loyalty Discount (5%):</span>
                <span className="text-red-600">-{formatCurrency(data.subtotal * 0.05)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-300 pt-2 mb-2">
              <span className="font-bold text-lg">Total:</span>
              <span className="font-bold text-lg">{formatCurrency(data.total)}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Payment Details:</h3>
          <p className="text-sm text-gray-600">Payment Method: {data.paymentMethod}</p>
          {data.paymentMethod === 'cash' && (
            <>
              <p className="text-sm text-gray-600">Amount Paid: {formatCurrency(data.amountPaid)}</p>
              <p className="text-sm text-gray-600">Change: {formatCurrency(data.changeAmount)}</p>
            </>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>Thank you for your business!</p>
          <p>This invoice was generated {formatDistanceToNow(invoiceDate, { addSuffix: true })}.</p>
        </div>
      </div>
    );
  });

  return (
    <>
      <Card className="w-full lg:w-1/3 shadow-2xl overflow-hidden flex flex-col bg-white dark:bg-gray-900 border-none rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-[#4A3933] to-[#3A2923] text-white p-6">
          <CardTitle className="text-2xl font-bold flex items-center justify-between">
            <span className="flex items-center">
              <ShoppingCart className="mr-2" /> Your Order
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-white border-black dark:border-white dark:bg-transparent bg-transparent transition-colors duration-300"
            >
             <Trash className="mr-2 h-4 w-4" /> Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex-grow overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                    {item.discount > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Discount: {item.discountType === 'percentage' ? `${item.discount}%` : formatCurrency(item.discount)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900">
                        <Percent className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
                      <h4 className="font-semibold text-lg mb-3 text-gray-800 dark:text-white">Item Discount</h4>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Discount"
                          value={item.discount}
                          onChange={(e) => updateItemDiscount(item._id, parseFloat(e.target.value) || 0, item.discountType)}
                          className="flex-grow"
                        />
                        <Select 
                          value={item.discountType} 
                          onValueChange={(value) => updateItemDiscount(item._id, item.discount, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">%</SelectItem>
                            <SelectItem value="fixed">$</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <Button size="icon" variant="ghost" className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400" onClick={() => updateQuantity(item._id, -1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium text-gray-800 dark:text-white">{item.quantity}</span>
                    <Button size="icon" variant="ghost" className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400" onClick={() => updateQuantity(item._id, 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item._id)} className="text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
        <div className="mt-auto p-6 bg-gray-50 dark:bg-gray-800 rounded-t-3xl shadow-inner">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Subtotal</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Discount</span>
              <span className="text-red-500">-{formatCurrency(calculateTotalDiscount())}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white">
              <span>Total</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Select onValueChange={setPaymentMethod} defaultValue={paymentMethod}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-700">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash"><div className="flex items-center"><DollarSign className="mr-2 h-4 w-4" /> Cash</div></SelectItem>
                <SelectItem value="card"><div className="flex items-center"><CreditCard className="mr-2 h-4 w-4" /> Card</div></SelectItem>
                <SelectItem value="mobile"><div className="flex items-center"><Smartphone className="mr-2 h-4 w-4" /> Mobile Payment</div></SelectItem>
              </SelectContent>
            </Select>

            {paymentMethod === 'cash' && (
              <div className="space-y-2 bg-white dark:bg-gray-700 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="amountPaid" className="w-1/3">Amount Paid:</Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    value={amountPaid}
                    onChange={handleAmountPaidChange}
                    className="flex-grow"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="changeAmount" className="w-1/3">Change:</Label>
                  <Input
                    id="changeAmount"
                    type="number"
                    value={changeAmount}
                    readOnly
                    className="flex-grow bg-gray-100 dark:bg-gray-600"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-4 rounded-xl">
              <Input
                type="number"
                placeholder="Discount"
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                className="flex-grow"
              />
              <Select onValueChange={setDiscountType} defaultValue={discountType}>
                <SelectTrigger className="w-1/3">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">%</SelectItem>
                  <SelectItem value="fixed">$</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="loyaltyCustomer"
                checked={isLoyaltyCustomer}
                onCheckedChange={setIsLoyaltyCustomer}
              />
              <Label htmlFor="loyaltyCustomer" className="text-sm text-gray-600 dark:text-gray-300">Loyalty Customer (5% extra discount)</Label>
            </div>
            <Button 
              onClick={handleCompletePurchase}
              className="w-full text-lg font-bold bg-gradient-to-r from-[#4A3933] to-[#3A2923] hover:from-[#3A2923] hover:to-[#4A3933] text-white transition-all duration-300" 
              size="lg"
            >
              <CreditCard className="mr-2" /> Complete Purchase
            </Button>

          </div>
        </div>
      </Card>
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Review Invoice</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto py-4">
            <div className="mb-4 space-y-2">
              <Input
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                placeholder="Customer Address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
              <Input
                placeholder="Customer City, State ZIP"
                value={customerCityStateZip}
                onChange={(e) => setCustomerCityStateZip(e.target.value)}
              />
            </div>
            {invoiceData && <Invoice ref={invoiceRef} data={{...invoiceData, customerName, customerAddress, customerCityStateZip}} />}
          </div>
          <DialogFooter className="mt-2">
            <Button onClick={handlePrint} className="mr-2">
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button onClick={handleDownloadImage} className="mr-2">
              <Download className="mr-2 h-4 w-4" /> Download Image
            </Button>
            <Button onClick={finalizeCheckout} className="mr-2">
              Complete Purchase
            </Button>
            <Button onClick={closeInvoiceDialog} variant="outline">Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}