function moneyStringToMoney(string) {
  return Number.parseFloat(string.replace("£", ""));
}

function discountPercentage(value, price) {
  const decimal = 1 - price / value;
  return Number.parseFloat((decimal * 100).toFixed(2));
}

const cards = Array.from(document.querySelectorAll(".itemlist__info")).map(
  (cardElement) => {
    const value = moneyStringToMoney(
      cardElement.querySelector(".cross_price").innerText,
    );

    const [goldPrice, silverPrice] = Array.from(
      cardElement.querySelectorAll(".memb-badge-container"),
    ).map((element) => moneyStringToMoney(element.innerText));

    const basePrice = Number.parseFloat(((silverPrice / 99) * 100).toFixed(2));

    return {
      value,
      base: {
        price: basePrice,
        discount: discountPercentage(value, basePrice),
      },
      silver: {
        price: silverPrice,
        discount: discountPercentage(value, silverPrice),
      },
      gold: {
        price: goldPrice,
        discount: discountPercentage(value, goldPrice),
      },
    };
  },
);

console.log(
  "cards sorted by discount value",
  cards.sort((a, b) => b.base.discount - a.base.discount),
);
