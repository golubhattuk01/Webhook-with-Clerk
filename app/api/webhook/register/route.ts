import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {


  const auth = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  async function sendMail(subject: string, text: string, data: any) {
    let customer = data.email_addresses[0].email_address

    if (!customer || !subject || !text) {
      return NextResponse.json({ message: "missing values" });
    }
    if (customer === process.env.EMAIL) {
      console.log("Welcome Admin");
      return NextResponse.json({ message: "Welcome Admin" });
    }
    if (customer === "example@example.org") {
      console.log("Welcome Clerk");
      // return NextResponse.json({ message: "Welcome Clerk" });
      customer = process.env.T_EMAIL;
      subject = 'TEMP SUBJECT'
      text = 'TEMP TEXT JUST FOR TESTING PURPOSE'
    }

    const receiver = {
      from: process.env.EMAIL,
      to: customer,
      subject: subject,
      text: text
    };

    try {
      const ans = await auth.sendMail(receiver);
      if (ans) {
        return NextResponse.json({ message: "Email sent successfully" });
      }
    } catch (error) {
      console.log
      return NextResponse.json({ message: "Email not sent" });
    }

  }

  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data
  const eventType = evt.type
  const { data } = evt;

  const text: string = `Thank you for registering with us. 
  We are excited to have you on board. 
  Please let us know if you have any queries. 
  We are here to help you. Have a great day ahead
  
  Gaurav Bhatt`
  const subject: string = "Welcome to the family";
  if (eventType === 'user.created') {
    const val = await sendMail(subject, text, data);
    console.log(val);
    return val;
  }

  // console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
  // console.log('Webhook payload:', body)

  return new Response('Webhook received', { status: 200 })
}

export async function GET() {

  const userId = 10;
  if (!userId) {
    return NextResponse.json({ message: 'This is testing route' })
  }
  return NextResponse.json({ message: 'This is testing route' })
}