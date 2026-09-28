export type SearchScenario = {
  term: string;
  expectedProduct: string;
};

export type CheckoutData = {
  fullName: string;
  address: string;
  cardNumber: string;
};

export const searchScenarios: SearchScenario[] = [
  {
    term: 'monitor',
    expectedProduct: 'UltraWide Monitor',
  },
  {
    term: 'audio',
    expectedProduct: 'Noise Cancelling Headphones',
  },
];

export const checkoutData: CheckoutData = {
  fullName: 'QA Automation',
  address: 'Av. das Boas Práticas, 1000 - São Paulo/SP',
  cardNumber: '4111111111111111',
};

export const checkoutProducts = ['Smart Watch Pro', 'Mechanical Keyboard'];
