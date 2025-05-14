
import { CartItem } from "@/contexts/CartContext";

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const sendOrderToWhatsApp = (
  items: CartItem[],
  userDetails: UserDetails,
  total: number,
  deliveryFee: number
) => {
  // Format the message
  const productsList = items
    .map(item => `• ${item.product.name} x${item.quantity} - KSh ${item.product.price * item.quantity}`)
    .join('\n');

  const message = `
🛍️ *NEW ORDER FROM KEV'SCUE BOUTIQUE* 🛍️

*Customer Details:*
Name: ${userDetails.name}
Email: ${userDetails.email}
Phone: ${userDetails.phone}
Delivery Address: ${userDetails.address}

*Order Summary:*
${productsList}

*Delivery Fee:* KSh ${deliveryFee}
*TOTAL:* KSh ${total + deliveryFee}

Thank you for your order!
`;

  // Format phone number (remove + if present)
  const phone = '254743455893';
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappURL = `https://wa.me/${phone}?text=${encodedMessage}`;
  
  // Open WhatsApp in new tab
  window.open(whatsappURL, '_blank');
  
  return true;
};
