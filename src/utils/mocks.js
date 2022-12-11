import { faker } from "@faker-js/faker";

faker.locale = 'es_MX'; // Setea el idioma a español de méxico

const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image: faker.image.business(),
        price: faker.commerce.price(),
        stock: faker.random.numeric(2),
        id: faker.database.mongodbObjectId(),
        timestamp: faker.datatype.datetime(),
        code: faker.address.zipCode()
    }
}

export { generateProduct }