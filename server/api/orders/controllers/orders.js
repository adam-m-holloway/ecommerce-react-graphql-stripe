// Goes at top of file
const stripe = require("stripe")("sk_test_fXFYGyARsUpfSXkWjJUyD55200nppysV5B");

create: async ctx => {
  const { address, amount, brews, postalCode, token, city } = ctx.request.body;

  // Send charge to Stripe
  const charge = await stripe.charges.create({
    amount: amount * 100,
    currency: "usd",
    description: `Order ${new Date(Date.now())} - User ${ctx.state.user._id}`,
    source: token
  });

  // Create order in database
  const order = await strapi.services.orders.add({
    user: ctx.state.user._id,
    address,
    amount,
    brews,
    postalCode,
    city
  });

  return order;
};
