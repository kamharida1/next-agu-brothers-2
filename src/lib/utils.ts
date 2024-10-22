import { format } from "date-fns";
import FormData from "form-data";
import Mailgun from "mailgun.js";

export const mailgun = new Mailgun(FormData);
export const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "pubkey-be2314140ea052c42f654b403d48147a",
});

export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export function convertDocToObj(doc: any) {
  doc._id = doc._id.toString();
  return doc;
}

export const formatPrice = (price: number | undefined) => {
  // Ensure price is a valid number
  if (typeof price !== "number" || isNaN(price)) {
    return "₦0"; // Fallback value for undefined or invalid price
  }

  // Format the price using toLocaleString
  return price.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  });
};

export const formatNumber = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatId = (x: string) => {
  return `..${x.substring(20, 24)}`;
};

export const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
};

export function toPlainObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toPlainObject);
  if (
    typeof obj !== "object" ||
    obj instanceof Date ||
    obj instanceof Buffer ||
    obj instanceof Uint8Array
  ) {
    return obj.toString();
  }

  const plainObj: any = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (
      typeof value === "object" &&
      !(value instanceof Date) &&
      !(value instanceof Buffer) &&
      !(value instanceof Uint8Array)
    ) {
      plainObj[key] = toPlainObject(value);
    } else {
      plainObj[key] = value;
    }
  }
  return plainObj;
}

export const formatDate = (date: any) => {
  const dateObj = new Date(date);
  return format(dateObj, "PPpp");
};

export const payOrderEmailTemplate = (order: any) => {
  return `
  <div>
    <h1>Thank you for your purchase</h2>
    <p>Hi, ${order.name}</p>
    <p>We have finished processing your order</p>
    <h2>[Order ${order.orderNumber}] (${order.createdAt.toString().substring(0, 10)})</h2>
    <table>
      <thead>
        <tr>
          <td><strong>Product</strong></td>
          <td><strong>Quantity</strong></td>
          <td><strong align="right">Price</strong></td>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item: any) => `
          <tr>
            <td>${item.name}</td>
            <td align="center">${item.quantity}</td>
            <td align="right">${formatPrice(item.price)}</td>
          </tr>
        `
          )
          .join("\n")}
      </tbody>
      <tfoot>
      <tr>
        <td colspan="2">Items Price:</td>
        <td align="right">${formatPrice(order.itemsPrice)}</td>
      </tr>
      <tr>
        <td colspan="2">Tax Price:</td>
        <td align="right">${formatPrice(order.taxPrice)}</td>
      </tr>
      <tr>
        <td colspan="2">Shipping Price:</td>
        <td align="right">${formatPrice(order.shippingPrice)}</td>
      </tr>
      <tr>
        <td colspan="2"><strong>Total Price:</strong></td>
        <td align="right"><strong>${formatPrice(order.totalPrice)}</strong></td>
      </tr>
      </tfoot>
    </table>
    <h2>Shipping Address</h2>
    <p>
      ${order.shippingAddress.fullName},<br/>
      ${order.shippingAddress.address},<br/>
      ${order.shippingAddress.city},<br/>
      ${order.shippingAddress.postalCode},<br/>
      ${order.shippingAddress.country}
    </p>
    <hr/>
    <p>Thanks for shopping with us.</p>
  </div>
  `;
}
