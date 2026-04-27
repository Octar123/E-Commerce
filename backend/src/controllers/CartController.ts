import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";
import { User } from "../entities/User";

class CartController {
  private userRepo = AppDataSource.getRepository(User);
  private cartItemRepo = AppDataSource.getRepository(CartItem);
  private cartRepo = AppDataSource.getRepository(Cart);
  private productRepo = AppDataSource.getRepository(Product);

  addToCart = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return res
          .status(404)
          .json({ success: false, error: "Product Not Found" });
      }
      const { quantity } = req.body || 1;

      if(quantity <= 0){
        return res.status(400).json({success: false, error: "Quantity can not be Zero or Negative"})
      }

      const user = (req as any).user;

      let cart = await this.cartRepo.findOne({
        where: { user: { id: user.id } },
        relations: ["cartItems", "cartItems.product"],
      });

      if (!cart) {
        cart = this.cartRepo.create({
          user: { id: user.id },
        });
        await this.cartRepo.save(cart);
      }

      cart = await this.cartRepo.findOne({
        where: { user: { id: user.id } },
        relations: ["cartItems", "cartItems.product"],
      });

      let cartItem = cart.cartItems.find((c) => c.product.id === id);

      let product  = await this.productRepo.findOneBy({id});

      if (cartItem) {
        const total = cartItem.quantity + quantity;
        if(total > cartItem.product.stockQuantity){
            return res.status(400).json({success: false, error: "Quantity greater than stock"});
        }else{
            cartItem.quantity += quantity;
        }
      } else {
        if(quantity > product.stockQuantity){
            return res.status(400).json({success: false, error: "Quantity greater than stock"});
        }else{
            cartItem = this.cartItemRepo.create({
              cart,
              product: { id },
              quantity,
            });
        }
      }

      await this.cartItemRepo.save(cartItem);

      res
        .status(200)
        .json({ success: true, message: "Product Added To Your Cart" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, error: "Error while Adding Product to Cart" });
    }
  };

  getCart = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      const cart = await this.cartRepo.findOne({
        where: { user: { id: user.id } },
        relations: ["cartItems", "cartItems.product"],
      });

      return res.json(cart);
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Error while retreiving cart" });
    }
  };

  updateQuantity = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      const itemId = Number(req.params.itemId);

      const { quantity } = req.body;

      const cart = await this.cartRepo.findOne({
        where: { user: { id: user.id } },
        relations: ["cartItems", "cartItems.product"],
      });

      let cartItem = cart.cartItems.find((item) => item.id === itemId);

      if (!cartItem) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid Cart Item" });
      }

      if (quantity > cartItem.product.stockQuantity) {
        return res.status(400).json({
          success: false,
          error: "Quantity is greater than the Stock Quantity",
        });
      }

      cartItem.quantity = quantity;

      await this.cartItemRepo.save(cartItem);
      res
        .status(200)
        .json({ success: false, message: "Quantity updated Successfully" });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          error: "Error Occurred during quantity updation",
        });
    }
  };

  deleteCartItem = async (req: Request, res: Response) => {
    try{
      const user = (req as any).user;

      const itemId = Number(req.params.itemId);

      const cart = await this.cartRepo.findOne({
        where: { user: { id: user.id } },
        relations: ["cartItems"],
      });

      const cartItem = cart.cartItems.find((item) => item.id === itemId);

      if (!cartItem) {
        return res
          .status(404)
          .json({ success: false, error: "Item not found" });
      }

      await this.cartItemRepo.delete(cartItem);

      return res
        .status(200)
        .json({ success: true, message: "Item deleted successfully" });
    }catch(error) {
        return res.status(500).json({success: false, error: "Error while deleteing Item"});
    }
  };

  deleteCart = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const cart = await this.cartRepo.findOneBy({user: {id: user.id}});

    if(!cart){
        return res.status(404).json({success: false, error: "Cart Not Found"});
    }

    await this.cartRepo.delete(cart);

    return res.status(200).json({success: true, message: "Cart Cleared Successfully"});
  }

  getCartTotal = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const cart = await this.cartRepo.findOne({
        where: {user: {id: user.id}},
        relations: ["cartItems", "cartItems.product"]
    });

    if(!cart){
        return res.json({});
    }

    const totalAmount = cart.cartItems.reduce((acc, item) => {
        const price = item.product.price;
        const quantity = item.quantity;
        return acc + (price * quantity);
    }, 0);

    const totalItems = cart.cartItems.reduce((acc, item) => {
        return acc + item.quantity;
    }, 0);

    return res.json({totalAmount, totalItems});
  }
}

export const cartController = new CartController();
