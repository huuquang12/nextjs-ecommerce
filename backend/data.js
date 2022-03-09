import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: 'ADMIN',
            email: 'admin@gmail.com',
            password: bcrypt.hashSync('123', 8),
            isAdmin: true,
            isSeller: true,
            seller: {
              name: 'Puma',
              logo: '/images/logo-addidas.png',
              description: 'Best Seller',
              rating: 4.5,
              numReviews: 120,
            },
          },
        {
            name: 'Nhat Le',
            email: 'lmnhat@gmail.com',
            password: bcrypt.hashSync('123', 8),
            isAdmin: false,
        }
    ],
    products: [
      {
        name: 'Adidas Fit Shirt',
        category: 'Shirts',
        image: '/images/shirt-original.jpg',
        price: 100,
        brand: 'Adidas',
        rating: 4.0,
        numReviews: 10,
        description: 'high quality product',
        countInStock: 5,
      },
      {
        name: 'Lacoste Free Shirt',
        category: 'Shirts',
        image: '/images/shirt-training.jpg',
        price: 220,
        brand: 'Lacoste',
        rating: 4.8,
        numReviews: 17,
        description: 'high quality product',
        countInStock: 5,
      },
      {
        name: 'Nike Slim Pant',
        category: 'Pants',
        image: '/images/shorts-classic.jpg',
        price: 78,
        brand: 'Nike',
        rating: 4.5,
        numReviews: 14,
        description: 'high quality product',
        countInStock: 5,
      },
      {
        name: 'Puma Slim Pant',
        category: 'Pants',
        image: '/images/shorts-running.jpg',
        price: 65,
        brand: 'Puma',
        rating: 4.5,
        numReviews: 10,
        description: 'high quality product',
        countInStock: 5,
      },
      {
        name: 'Adidas Fit Pant',
        category: 'Pants',
        image: '/images/shorts-original.jpg',
        price: 139,
        brand: 'Adidas',
        rating: 4.5,
        numReviews: 15,
        description: 'high quality product',
        countInStock: 5,
      },
    ],
  };

  export default data;