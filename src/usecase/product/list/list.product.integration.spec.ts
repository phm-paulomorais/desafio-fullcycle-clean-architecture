import { Sequelize } from "sequelize-typescript";
import ListProductUseCase from "./list.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";


const input1 = {
    name: "Product test",
    price: 12
  };

const input2 = {
    name: "Product test",
    price: 12
};  

describe("Unit test for listing product use case", () => {

  let sequelize: Sequelize;  

  beforeEach(async () => {
     sequelize = new Sequelize({
     dialect: "sqlite",
     storage: ":memory:",
     logging: false,
     sync: { force: true },
    });

     await sequelize.addModels([ProductModel]);
     await sequelize.sync();
    });

    afterEach(async () => {
      await sequelize.close();
    });
  

  it("should list a product", async () => {
    const repository = new ProductRepository();

    const productCreateUseCase = new CreateProductUseCase(repository);
    const product1 = await productCreateUseCase.execute(input1);
    const product2 = await productCreateUseCase.execute(input2);

    const useCase = new ListProductUseCase(repository);
    const output = await useCase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(product1.id);
    expect(output.products[0].name).toBe(product1.name);
    expect(output.products[0].price).toBe(product1.price);
    expect(output.products[1].id).toBe(product2.id);
    expect(output.products[1].name).toBe(product2.name);
    expect(output.products[1].price).toBe(product2.price);
  });
});
