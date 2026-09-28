import { expect } from '@playwright/test';

import { APP_ROUTES } from '../config/routes';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  private readonly selectors = {
    searchInput: this.page.getByTestId('search-input'),
    grid: this.page.getByTestId('products-grid'),
    feedback: this.page.getByTestId('products-feedback'),
    cartBadge: this.page.getByTestId('cart-badge'),
  };

  async goto(): Promise<void> {
    await super.goto(APP_ROUTES.products);
  }

  productCard(name: string) {
    return this.page.locator('[data-testid="product-card"]').filter({ hasText: name });
  }

  async search(term: string): Promise<void> {
    await this.selectors.searchInput.fill(term);
  }

  async addProductToCart(productName: string): Promise<void> {
    const product = this.productCard(productName);
    await expect(product).toBeVisible();
    await product.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  }

  async expectProductVisible(productName: string): Promise<void> {
    await expect(this.productCard(productName)).toBeVisible();
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.selectors.cartBadge).toHaveText(String(count));
  }

  async expectAddToCartFeedback(productName: string): Promise<void> {
    await expect(this.selectors.feedback).toContainText(
      `${productName} foi adicionado ao carrinho.`,
    );
  }
}
