import { itemType } from "../cart/cart-types";

const addItemToCart = (cartItems: any[], item: any, add_one = false) => {
  const duplicate = cartItems.some(
    (cartItem) =>
      cartItem.option === item.option &&
      cartItem.id === item.id &&
      cartItem.size === item.size
  );

  if (duplicate) {
    return cartItems.map((cartItem) => {
      let itemQty = 0;
      !item.qty || add_one
        ? (itemQty = cartItem.qty! + 1)
        : (itemQty = item.qty);

      console.log(itemQty);
      return cartItem.option === item.option &&
        cartItem.id === item.id &&
        cartItem.size === item.size
        ? { ...cartItem, qty: itemQty }
        : cartItem;
    });
  }
  // console.log(itemQty);
  let itemQty = 0;
  !item.qty ? itemQty++ : (itemQty = item.qty);
  return [
    ...cartItems,
    {
      id: item.id,
      option: item.option,
      size: item?.size,
      name: item.name,
      price: item.price,
      img1: item.img1,
      img2: item.img2,
      qty: itemQty,
    },
  ];
};

export default addItemToCart;
