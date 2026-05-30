import { mg } from './utils'
import { formatPrice } from './utils'

const FROM = 'Agu Brothers <orders@agubrothers.com>'
const DOMAIN = process.env.NEXT_PUBLIC_MAILGUN_DOMAIN || 'sandboxf039d48ba90f4eda89678aa376f41d86.mailgun.org'

export async function sendOrderConfirmationEmail(order: any) {
  const itemRows = order.items.map((item: any) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.qty}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatPrice(item.price)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatPrice(item.price * item.qty)}</td>
    </tr>
  `).join('')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EAEDED;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EAEDED;padding:20px 0">
    <tr><td>
      <table width="600" cellpadding="0" cellspacing="0" align="center" style="background:#fff;max-width:600px;width:100%">

        <!-- Header -->
        <tr>
          <td style="background:#131921;padding:20px 30px">
            <span style="color:#FF9900;font-size:24px;font-weight:bold">agu</span>
            <span style="color:#fff;font-size:24px;font-weight:bold">brothers</span>
          </td>
        </tr>

        <!-- Hero -->
        <tr>
          <td style="background:#FF9900;padding:20px 30px">
            <h1 style="margin:0;color:#131921;font-size:22px">Order Confirmed! 🎉</h1>
            <p style="margin:6px 0 0;color:#131921;font-size:14px">
              Thank you, ${order.shippingAddress.fullName.split(' ')[0]}. We've received your order and are processing it now.
            </p>
          </td>
        </tr>

        <!-- Order ID -->
        <tr>
          <td style="padding:20px 30px;background:#F7F8F8;border-bottom:1px solid #eee">
            <p style="margin:0;font-size:13px;color:#565959">Order number</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:bold;color:#0F1111;font-family:monospace">
              #${order._id.toString().slice(-8).toUpperCase()}
            </p>
            <p style="margin:4px 0 0;font-size:13px;color:#565959">
              Payment: ${order.isPaid ? '✅ Paid via Paystack' : '🚚 Cash on Delivery'}
            </p>
          </td>
        </tr>

        <!-- Items -->
        <tr>
          <td style="padding:20px 30px">
            <h2 style="margin:0 0 12px;font-size:16px;color:#0F1111">Items Ordered</h2>
            <table width="100%" cellpadding="0" cellspacing="0">
              <thead>
                <tr style="background:#F7F8F8">
                  <th style="padding:8px;text-align:left;font-size:12px;color:#565959;text-transform:uppercase">Item</th>
                  <th style="padding:8px;text-align:center;font-size:12px;color:#565959;text-transform:uppercase">Qty</th>
                  <th style="padding:8px;text-align:right;font-size:12px;color:#565959;text-transform:uppercase">Price</th>
                  <th style="padding:8px;text-align:right;font-size:12px;color:#565959;text-transform:uppercase">Total</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>

            <!-- Totals -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px">
              <tr>
                <td style="padding:4px 8px;color:#565959;font-size:13px">Subtotal</td>
                <td style="padding:4px 8px;text-align:right;font-size:13px">${formatPrice(order.itemsPrice)}</td>
              </tr>
              <tr>
                <td style="padding:4px 8px;color:#565959;font-size:13px">Shipping</td>
                <td style="padding:4px 8px;text-align:right;font-size:13px">${formatPrice(order.shippingPrice)}</td>
              </tr>
              <tr>
                <td style="padding:4px 8px;color:#565959;font-size:13px">Tax</td>
                <td style="padding:4px 8px;text-align:right;font-size:13px">${formatPrice(order.taxPrice)}</td>
              </tr>
              <tr style="border-top:2px solid #131921">
                <td style="padding:8px;font-weight:bold;font-size:15px;color:#0F1111">Total</td>
                <td style="padding:8px;text-align:right;font-weight:bold;font-size:15px;color:#CC0C39">${formatPrice(order.totalPrice)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Delivery Address -->
        <tr>
          <td style="padding:20px 30px;background:#F7F8F8;border-top:1px solid #eee">
            <h2 style="margin:0 0 10px;font-size:16px;color:#0F1111">Delivery Address</h2>
            <p style="margin:0;font-size:14px;color:#0F1111;line-height:1.6">
              ${order.shippingAddress.fullName}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}<br>
              <strong>Phone:</strong> ${order.shippingAddress.phone}
            </p>
          </td>
        </tr>

        <!-- Track order CTA -->
        <tr>
          <td style="padding:24px 30px;text-align:center">
            <a href="https://www.agubrothers.com/order/${order._id}"
               style="background:#FF9900;color:#131921;text-decoration:none;padding:12px 32px;
                      border-radius:4px;font-weight:bold;font-size:14px;display:inline-block">
              View Your Order
            </a>
          </td>
        </tr>

        <!-- Help -->
        <tr>
          <td style="padding:16px 30px;background:#131921;text-align:center">
            <p style="margin:0;color:#CCCCCC;font-size:12px">
              Questions? WhatsApp us: <a href="https://wa.me/2349099234242" style="color:#FF9900">+234 909 923 4242</a>
              &nbsp;|&nbsp;
              <a href="mailto:info@agubrothers.com" style="color:#FF9900">info@agubrothers.com</a>
            </p>
            <p style="margin:8px 0 0;color:#565959;font-size:11px">
              © Agu Brothers Electronics, 33 Ogui Road, Enugu, Nigeria
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `

  try {
    await mg.messages.create(DOMAIN, {
      from: FROM,
      to: [order.shippingAddress.email],
      subject: `Order Confirmed #${order._id.toString().slice(-8).toUpperCase()} — Agu Brothers`,
      html,
    })
  } catch (err) {
    // Non-fatal — log but don't break the order flow
    console.error('[email] Failed to send order confirmation:', err)
  }
}

export async function sendAdminOrderNotification(order: any) {
  const html = `
    <h2>New Order Received 🛒</h2>
    <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
    <p><strong>Customer:</strong> ${order.shippingAddress.fullName}</p>
    <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
    <p><strong>City:</strong> ${order.shippingAddress.city}</p>
    <p><strong>Total:</strong> ${formatPrice(order.totalPrice)}</p>
    <p><strong>Payment:</strong> ${order.isPaid ? 'Paid (Paystack)' : 'Cash on Delivery'}</p>
    <p><strong>Items:</strong> ${order.items.length} item(s)</p>
    <a href="https://www.agubrothers.com/order/${order._id}">View Order →</a>
  `

  try {
    await mg.messages.create(DOMAIN, {
      from: FROM,
      to: ['agubiggest@gmail.com'],
      subject: `New Order #${order._id.toString().slice(-8).toUpperCase()} — ${formatPrice(order.totalPrice)}`,
      html,
    })
  } catch (err) {
    console.error('[email] Failed to send admin notification:', err)
  }
}
