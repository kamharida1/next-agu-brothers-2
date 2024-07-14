import { format } from 'date-fns';

export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100

export function convertDocToObj(doc: any) {
  doc._id = doc._id.toString()
  return doc
}

export const formatNumber = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatId = (x: string) => {
  return `..${x.substring(20, 24)}`
}

export function toPlainObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toPlainObject);
  if (typeof obj !== 'object' || obj instanceof Date || obj instanceof Buffer) return obj.toString();

  const plainObj: any = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === 'object' && !(value instanceof Date) && !(value instanceof Buffer)) {
      plainObj[key] = toPlainObject(value);
    } else {
      plainObj[key] = value;
    }
  }
  return plainObj;
}

export const formatPrice = (price: number, factor: number = 1) => {
  if (typeof price !== "number") {
    return "Invalid Price";
  }

  // Increase price by the given factor
  const updatedPrice = price * factor;

  return updatedPrice.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const formatDate = (date: any) => { 
  const dateObj = new Date(date);
  return format(dateObj, 'PPpp')
}
