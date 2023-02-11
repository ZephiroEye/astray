const stripe = require('stripe')(process.env.testkey);
const express = require('express');
const app = express();

const {Firestore} = require('@google-cloud/firestore');

app.use(express.static('public'));

const YOUR_DOMAIN = 'exalibes.web.app/test';





const firebaseConfig = { 
  type: "service_account",
  project_id : "myprjzph",
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email: "firebase-adminsdk-876vx@myprjzph.iam.gserviceaccount.com",
  client_id: "116823282943321186678",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-876vx%40myprjzph.iam.gserviceaccount.com"

};

const db = new Firestore(firebaseConfig);

  
  

app.post('/create-checkout-session', async (req, res) => {

    //genera token
    const gntkn = Math.random().toString(36).slice(2);

    const docRef = db.collection('tkn').doc(gntkn);

    await docRef.set({ 
        value:10
    });


  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1Ma6iVDrnGXHk26Vdx7x90mc',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html?${gntkn}`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.json(session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));