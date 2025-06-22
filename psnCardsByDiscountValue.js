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
  basePrice;
  silverPrice;
  goldPrice;
  #_baseDiscount;
  #_silverDiscount;
  #_goldDiscount;

  constructor(value, basePrice, silverPrice, goldPrice) {
    this.value = value;
    this.basePrice = basePrice;
    this.silverPrice = silverPrice;
    this.goldPrice = goldPrice;
  }

  static fromHtmlElement(cardElement) {
    const value = new Money({
      string: cardElement.querySelector(".cross_price").innerText,
    });

    const [goldPrice, silverPrice] = Array.from(
      cardElement.querySelectorAll(".memb-badge-container"),
    ).map((element) => new Money({ string: element.innerText }));

    const basePrice = new Money({
      number: Number.parseFloat(((silverPrice.number / 99) * 100).toFixed(2)),
    });

    return new Card(value, basePrice, silverPrice, goldPrice);
  }

  baseDiscount() {
    this._baseDiscount ||= new Discount(this.basePrice, this.value);
    return this._baseDiscount;
  }

  silverDiscount() {
    this._silverDiscount ||= new Discount(this.silverPrice, this.value);
    return this._silverDiscount;
  }

  goldDiscount() {
    this._goldDiscount ||= new Discount(this.goldPrice, this.value);
    return this._goldDiscount;
  }

  print({ extended } = { extended: false }) {
    const logArgs = [
      "",
      this.value.string.replace(".00", "").padStart(4, " "),
      "      ",
      this.baseDiscount().string.padStart(6, " "),
      "  ",
      this.basePrice.string.padStart(7, " "),
      "        ",
    ];

    if (extended) {
      logArgs.push(
        this.silverDiscount().string.padStart(6, " "),
        "    ",
        this.silverPrice.string.padStart(7, " "),
        "      ",
        this.goldDiscount().string.padStart(6, " "),
        "  ",
        this.goldPrice.string.padStart(7, " "),
      );
    }

    console.log(...logArgs);
  }
}

function printDiscounts({ extended } = { extended: false }) {
  if (extended) {
    console.log(
      "value  baseDiscount  basePrice  silverDiscount  silverPrice  goldDiscount  goldPrice",
    );
  } else {
    console.log("value  baseDiscount  basePrice");
  }

  Array.from(document.querySelectorAll(".itemlist__info"))
    .map(Card.fromHtmlElement)
    .sort((a, b) => b.baseDiscount().number - a.baseDiscount().number)
    .forEach((card) => card.print({ extended }));
}

console.log(`run one of:
$ printDiscounts()
$ printDiscounts({ extended: true })`);
