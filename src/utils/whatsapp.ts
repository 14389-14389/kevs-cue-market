
import { toast } from "@/components/ui/use-toast";

export interface WhatsAppOrderUser {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  category: string;
}

export const sendOrderToWhatsApp = (
  cartItems: CartItem[], 
  userDetails: WhatsAppOrderUser,
  subtotal: number,
  deliveryFee: number
) => {
  try {
    // Format phone number - assuming Kenya phone number format
    const adminPhone = "254722000000"; // Replace with your WhatsApp business number
    
    // Create order message
    let message = `*New Order from KevsCue Boutique*\n\n`;
    message += `*Customer Details*\n`;
    message += `Name: ${userDetails.name}\n`;
    message += `Email: ${userDetails.email}\n`;
    message += `Phone: ${userDetails.phone}\n`;
    message += `Address: ${userDetails.address}\n\n`;
    
    message += `*Order Items*\n`;
    cartItems.forEach(item => {
      message += `- ${item.name} (×${item.quantity}) - KSh ${item.price.toLocaleString()}\n`;
    });
    
    message += `\n*Order Summary*\n`;
    message += `Subtotal: KSh ${subtotal.toLocaleString()}\n`;
    message += `Delivery Fee: KSh ${deliveryFee.toLocaleString()}\n`;
    message += `Total: KSh ${(subtotal + deliveryFee).toLocaleString()}\n\n`;
    
    message += `Thank you for your order!`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp link
    const whatsappLink = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp link in new window
    window.open(whatsappLink, '_blank');
    
    toast({
      title: "Order Sent",
      description: "Your order has been sent via WhatsApp. Complete the checkout there.",
    });
    
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp order:", error);
    toast({
      title: "Order Error",
      description: "There was an error sending your order. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};
