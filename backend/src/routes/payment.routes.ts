import { Request, Response, Router } from "express";
import { addToCart, getCartList } from "../controllers/cart.controller";
import { VnpParams } from "../types/VnpParams";
import moment from "moment";

import crypto from "crypto";
import qs from "qs";
import { v4 as uuidv4 } from "uuid";
import { cassandraClient } from "../config/db";
import { CartItem } from "../models/CartItem";

const router = Router();

const VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // Use production URL when live
const TMN_CODE = process.env.VNP_TMNCODE || "";
const SECRET_KEY = process.env.VNP_HASHSECRET || "";
const RETURN_URL = "http://localhost:3000/payment-success"; // Change to your frontend success page


function sortObject(obj: any) {
  const sorted: { [key: string]: string } = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  
  return sorted;
}


export function formatDateToVnpCreateDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

const createPayment = async (req: Request, res: Response) => {
    try {
      const {  customer_id, paymentMethod, cartItems,  name, address, phone } = req.body;



      const order_id = uuidv4();
      const created_at = new Date();
      const updated_at = new Date();
      const status = "pending";

      console.log("in payment api ", req.body );
      


      const orderId = uuidv4();
      console.log("COD Order Created:", orderId);


    // Calculate total
    const total_amount = cartItems.reduce((sum:any, item:any) => sum + item.total_price, 0);

    const insertOrderQuery = `
  INSERT INTO seller_orders (customer_id, order_id, total_amount, payment_method, address, phone, name, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, toTimestamp(now()), toTimestamp(now()));
`;

await cassandraClient.execute(insertOrderQuery, [
  customer_id, order_id, total_amount, paymentMethod, address, phone, name, status
]);


// Insert items into seller_order_items
const query = `
INSERT INTO seller_order_items (seller_id, order_id, product_id, quantity, price, total_price)
VALUES (?, ?, ?, ?, ?, ?);
`;

for (let item of cartItems) {
const { seller_id, product_id, quantity, price, total_price } = item;

console.log(" item is ", item);


const quantityValue = parseInt(quantity, 10);  // Ensure quantity is an integer

    // Type cast price and total_price to DECIMAL (floating point number)
    const priceValue = parseFloat(price);  // Ensure price is a floating-point number
    const totalPriceValue = parseFloat(total_price);  //

  // Validate the casting
  if (isNaN(quantityValue)) {
    throw new Error('Invalid quantity: it must be an integer');
  }
  if (isNaN(priceValue)) {
    throw new Error('Invalid price: it must be a valid decimal number');
  }
  if (isNaN(totalPriceValue)) {
    throw new Error('Invalid total price: it must be a valid decimal number');
  }

// Execute the query to insert each item into seller_order_items table
await cassandraClient.execute(query, [seller_id, order_id, product_id, quantityValue, priceValue, totalPriceValue],{ prepare: true });


if (paymentMethod === "cod") {
  // 👉 Handle COD: Save order to DB with status = "pending"
 
// Delete from MongoDB cart
await CartItem.deleteMany({ user_id: customer_id });
  // Save to DB logic here...

  return res.status(200).json({
    message: "Order placed with COD.",
    orderId,
  });
}

if (paymentMethod === "vnpay") {



let date = new Date();
const orderId = moment(date).format("DDHHmmss");

console.log("vlaue " + TMN_CODE + SECRET_KEY);



const now = new Date();
  const vnpCreateDate = formatDateToVnpCreateDate(now);

  const gmt7Offset = 7 * 60;
  const localOffset = now.getTimezoneOffset();
  const gmt7Time = new Date(
    now.getTime() + (gmt7Offset + localOffset) * 60 * 1000,
  );

  gmt7Time.setMinutes(gmt7Time.getMinutes() + 15);

  const vnpExpireDate = formatDateToVnpCreateDate(gmt7Time);

  const url = "http://localhost:5001/api/vnpay-return";
  const vnpIpAddr =
  req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress;

  let vnp_Params:  Partial<VnpParams> = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = TMN_CODE;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params['vnp_Locale'] = 'vn';
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = `${customer_id}_${order_id}`;
    vnp_Params['vnp_OrderInfo'] = `Thanh toan cho ma GD:`;
  vnp_Params['vnp_Amount'] = total_amount * 100;
  
  vnp_Params['vnp_ReturnUrl'] = url;
  vnp_Params['vnp_IpAddr'] = '127.0.0.1';
  vnp_Params['vnp_CreateDate'] = vnpCreateDate;
  vnp_Params['vnp_OrderType'] = 'other';
  // vnp_Params['customer_id']= String(customer_id);
  // vnp_Params['vnp_ExpireDate'] = vnpExpireDate;

  console.log("value is ", TMN_CODE, SECRET_KEY);
  

  console.log("VNPAY Return URL:", vnp_Params['vnp_ReturnUrl']);
//   if (bankCode) {
//     vnp_Params["vnp_BankCode"] = bankCode;
//   }

  // Sort params alphabetically
  vnp_Params = sortObject(vnp_Params);

  

  const signData: string = qs.stringify(vnp_Params, { encode: false })

  const hmac = crypto.createHmac('sha512', SECRET_KEY);
  const signed: string = hmac
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;

  const paymentUrl = `${VNPAY_URL}?${qs.stringify(vnp_Params, { encode: false })}`;
  return res.json({ paymentUrl });
}


}



    } catch (error) {
      console.error("VNPAY Error:", error);
      return res.status(500).json({ message: "Payment error" });
    }
  }
  
  const paymentSuccess = async (request: Request, response: Response ) => {


    console.log("in payment success");
    
    
    let vnp_Params = request.query;
    
    let secureHash = vnp_Params['vnp_SecureHash']

    let TxnRef = vnp_Params['vnp_TxnRef']
    let rspCode = vnp_Params['vnp_ResponseCode']

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    vnp_Params = sortObject(vnp_Params)
    let secretKey = process.env.VNP_HASHSECRET
    let signData = qs.stringify(vnp_Params, { encode: false })
    let hmac = crypto.createHmac('sha512', SECRET_KEY)
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
    const customerId = vnp_Params['customer_id']; // Ensure customer_id is part of the query parameters
    let paymentStatus = '0' // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

    let checkOrderId = true // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    let customer_id = null;
    let order_id = null;
    
    if (TxnRef) {
      // Split TxnRef by underscore to get customer_id and order_id
      [customer_id, order_id] = (TxnRef as string).split('_'); 
    
      // Log the extracted customer_id and order_id
      console.log('Extracted customer_id:', customer_id);
      console.log('Extracted order_id:', order_id);
    } else {
      console.log("TxnRef is missing or invalid.");
    }
    

    if (secureHash === signed)  {
      try {
        console.log("delete existing");

        
    // Step 1: Fetch cart items from MongoDB for the customer and order_id
    const cartItems = await CartItem.find({ customer_id, order_id });
        
        // Update the seller_orders table to mark the order as paid
        await cassandraClient.execute(
            `UPDATE seller_orders 
             SET status = 'paid', updated_at = toTimestamp(now()) 
             WHERE customer_id = ? AND order_id = ?`,
            [customer_id, order_id]  // Ensure customer_id and order_id are passed here
        );

        // Delete items from seller_order_items table
     

        for (const cartItem of cartItems) {
          await cassandraClient.execute(
            `INSERT INTO seller_order_items (seller_id, order_id, product_id, quantity, price, total_price) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [customer_id, order_id, cartItem.product_id, cartItem.quantity, cartItem.price, cartItem.total_price]
          );
        }


        await CartItem.deleteMany({ user_id: customer_id });


        // Send the response after all database operations are completed
        return response.redirect('http://localhost:3000/success');
    } catch (error) {
        console.error("Error occurred:", error);
        // Handle error, you may want to send an error response if the database operations fail
        return response.status(500).send("Internal Server Error");
    }
      } else {
        console.log("failure payment");
        
        // ❌ Payment failed: delete items first, then delete the order
        await cassandraClient.execute(`
          DELETE FROM seller_order_items WHERE  order_id = ?
        `, [ order_id]);
  
        await cassandraClient.execute(`
          DELETE FROM seller_orders WHERE order_id = ?
        `, [ order_id]);
  
        response.redirect('http://localhost:3000/failure');      }

  };


router.post("/api/create-payment" , createPayment);


router.get('/api/vnpay-return', paymentSuccess)

export default router;