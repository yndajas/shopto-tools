class Money {
  number;
  string;

  constructor({ number, string } = {}) {
    if (number) {
      this.number = number;
      this.string = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(number);
    } else {
      this.string = string;
      this.number = Number.parseFloat(string.replace("£", ""));
    }
  }
}

class Discount {
  number;
  string;

  constructor(price, value) {
    this.number = 1 - price.number / value.number;
    this.string = new Intl.NumberFormat("en-GB", {
      style: "percent",
      minimumFractionDigits: 2,
    }).format(this.number);
  }
}

class Card {
  value;
  price;
  #_discount;

  constructor(value, price) {
    this.value = value;
    this.price = price;
  }

  static fromHtmlElement(cardElement, unformattedPrice) {
    const value = new Money({
      string: cardElement.querySelector(".cross_price").innerText,
    });

    const price = new Money({
      number: Number.parseFloat(unformattedPrice).toFixed(2),
    });

    return new Card(value, price);
  }

  discount() {
    this._discount ||= new Discount(this.price, this.value);
    return this._discount;
  }

  print() {
    console.log(
      ...[
        "",
        this.value.string.replace(".00", "").padStart(4, " "),
        "  ",
        this.discount().string.padStart(6, " "),
        "",
        this.price.string.padStart(7, " "),
        "        ",
      ],
    );
  }
}

function printDiscounts(count, prices) {
  const cardElements = Array.from(
    document.querySelectorAll(".itemlist__info"),
  ).slice(0, count);

  if (!prices || prices.length !== cardElements.length) {
    console.error("missing prices");
    return;
  }

  console.log("value  discount    price");

  cardElements
    .map((element, index) => Card.fromHtmlElement(element, prices[index]))
    .sort((a, b) => b.discount().number - a.discount().number)
    .forEach((card) => card.print());
}

// update this as needed
printDiscounts(
  9,
  [43.95, 84.13, 36.11, 58.65, 18.47, 9.65, 100.79, 127.25, 169.39],
);
