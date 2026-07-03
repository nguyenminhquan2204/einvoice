import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductTcpRequest } from '@common/interfaces/tcp/product';

@Injectable()
export class ProductService {
  constructor(private readonly productRepositoy: ProductRepository) {}

  async create(data: CreateProductTcpRequest) {
    const { sku, name } = data;

    const exists = await this.productRepositoy.exists(sku, name);
    if (exists) {
      throw new BadRequestException('Product already exitsts');
    }

    return this.productRepositoy.create(data);
  }

  getList() {
    return this.productRepositoy.findAll();
  }
}
