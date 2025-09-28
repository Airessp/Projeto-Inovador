// lib/cartUtils.ts

// 🔹 Guardar carrinho de um utilizador
export const saveCartForUser = (username: string, cartItems: any[]) => {
  localStorage.setItem(`cart_${username}`, JSON.stringify(cartItems))
}

// 🔹 Carregar carrinho de um utilizador
export const loadCartForUser = (username: string) => {
  return JSON.parse(localStorage.getItem(`cart_${username}`) || "[]")
}
