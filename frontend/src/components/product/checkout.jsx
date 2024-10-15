import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearCart } from '@/redux/cartSlice';

const Checkout = ({ onBack, onComplete }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the order to your backend
    console.log('Order submitted:', { items: cartItems, customerInfo: formData });
    dispatch(clearCart());
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
        </div>
        <div className="flex-1">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} required />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input id="expiryDate" name="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={handleInputChange} required />
        </div>
        <div className="flex-1">
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" name="cvv" value={formData.cvv} onChange={handleInputChange} required />
        </div>
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Complete Order
      </Button>
      <Button variant="outline" className="w-full" onClick={onBack}>
        Back to Cart
      </Button>
    </form>
  );
};

export default Checkout;
