
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as nodemailer from "nodemailer";
import {defineString} from "firebase-functions/params";


const app = initializeApp();
const db = getFirestore("cakemaster");
const gmailEmail = defineString("GMAIL_EMAIL");
const gmailPassword = defineString("GMAIL_PASSWORD");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail.value(),
        pass: gmailPassword.value()
    }
});


interface OrderData {
  flavor: string;
  frosting?: string;
  topping?: string;
  size: string;
  decorations: string;
  pickupDate: string; // ISO string
  email: string;
  phone?: string;
  price: number;
}

export const submitOrder = onCall<OrderData>(async (request) => {
  const { data } = request;

  logger.info("Received new order submission:", data);

  // Basic validation
  if (!data.flavor || !data.size || !data.email) {
    logger.error("Validation failed: Missing required fields");
    throw new HttpsError(
      "invalid-argument",
      "Missing required order fields.",
    );
  }

  try {
    const orderWithTimestamp = {
      ...data,
      pickupDate: new Date(data.pickupDate),
      createdAt: new Date(),
      status: 'pending',
    };

    const writeResult = await db.collection("orders").add(orderWithTimestamp);
    logger.info("Successfully wrote order to Firestore with ID:", writeResult.id);

    // Helper to format date, as date-fns is not available here
    const formattedPickupDate = new Date(data.pickupDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const mailOptions = {
        from: `Cake Master <${gmailEmail.value()}>`,
        to: "tashpulatov.jakhongir@gmail.com",
        subject: `New Cake Order Received: ${writeResult.id}`,
        html: `
            <h1>New Order Details</h1>
            <p><strong>Order ID:</strong> ${writeResult.id}</p>
            <p><strong>Flavor:</strong> ${data.flavor}</p>
            <p><strong>Size:</strong> ${data.size}</p>
            <p><strong>Frosting:</strong> ${data.frosting || 'N/A'}</p>
            <p><strong>Topping:</strong> ${data.topping || 'N/A'}</p>
            <p><strong>Decorations:</strong> ${data.decorations}</p>
            <p><strong>Pickup Date:</strong> ${formattedPickupDate}</p>
            <p><strong>Price:</strong> ${data.price} CZK</p>
            <hr>
            <p><strong>Customer Email:</strong> ${data.email}</p>
            <p><strong>Customer Phone:</strong> ${data.phone || 'N/A'}</p>
        `
    };

    await transporter.sendMail(mailOptions);
    logger.info('Notification email sent successfully.');

    return { success: true, orderId: writeResult.id };
  } catch (error: any) {
    logger.error("Error submitting order:", error);
    throw new HttpsError(
      'internal',
      error.message || "An error occurred while placing the order.",
    );
  }
});
