import "bootstrap";
import "./style.css";

// 1) ENTIDAD Carta
class Carta {
  constructor(valor, palo) {
    this.valor = valor;
    this.palo  = palo;
  }
}

// 2) GENERADOR de cartas aleatorias
class GeneradorCartas {
  constructor() {
    this.valores = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
    this.palos   = ["corazones","diamantes","treboles","picas"];
  }
  generar() {
    const v = this.valores[
      Math.floor(Math.random() * this.valores.length)
    ];
    const p = this.palos[
      Math.floor(Math.random() * this.palos.length)
    ];
    return new Carta(v, p);
  }
}

// 3) RENDERIZADOR en DOM
class RenderizadorCartas {
  constructor(selector) {
    this.contenedor = document.querySelector(selector);
    this.factorTexto   = 2.5;  // alto/factor → tamaño del número
    this.factorSimbolo = 4;    // alto/factor → tamaño de las pintas
  }

  renderizar(carta, ancho = 380, alto = 500) {
    this.contenedor.innerHTML = "";
    const cartaEl = document.createElement("div");
    cartaEl.className = `carta ${carta.palo}`;
    // dimensiones + tamaño número
    cartaEl.style.width    = `${ancho}px`;
    cartaEl.style.height   = `${alto}px`;
    cartaEl.style.fontSize = `${Math.round(alto / this.factorTexto)}px`;

    // crea símbolos y les aplica tamaño dinámico
    ["superior","inferior"].forEach(pos => {
      const s = document.createElement("div");
      s.className   = `simbolo ${pos}`;
      s.textContent = RenderizadorCartas.simboloDe(carta.palo);
      s.style.fontSize = `${Math.round(alto / this.factorSimbolo)}px`;
      cartaEl.appendChild(s);
    });

    // valor central
    const v = document.createElement("span");
    v.textContent = carta.valor;
    cartaEl.appendChild(v);

    this.contenedor.appendChild(cartaEl);
  }

  static simboloDe(palo) {
    return {
      corazones: "♥",
      diamantes: "♦",
      treboles:  "♣",
      picas:     "♠"
    }[palo] || "";
  }
}

// 4) TEMPORIZADOR
class Temporizador {
  constructor(intervalo, fn) {
    this.intervalo = intervalo;
    this.fn        = fn;
    this.id        = null;
  }
  iniciar() {
    if (!this.id) this.id = setInterval(this.fn, this.intervalo);
  }
  alternar() {
    if (this.id) { clearInterval(this.id); this.id = null; }
    else         { this.iniciar(); }
  }
}

// 5) APLICACIÓN
class GestorCartasApp {
  constructor() {
    this.generador    = new GeneradorCartas();
    this.renderizador = new RenderizadorCartas("#caja-carta");
    this.temporizador = new Temporizador(10000, () => this.mostrar());
    this._cacheDom();
    this._conectaEventos();
    this.mostrar();
  }

  _cacheDom() {
    this.inAncho  = document.getElementById("ancho-carta");
    this.inAlto   = document.getElementById("alto-carta");
    this.btnNew   = document.getElementById("boton-nueva-carta");
    this.btnTimer = document.getElementById("boton-temporizador");
  }

  _conectaEventos() {
    this.btnNew.addEventListener("click", () => this.mostrar());
    this.btnTimer.addEventListener("click", () => {
      this.temporizador.alternar();
      this.btnTimer.textContent = this.temporizador.id
        ? "Temporizador ON" : "Temporizador OFF";
    });
    [this.inAncho, this.inAlto].forEach(i =>
      i.addEventListener("input", () => this._ajustarCarta())
    );
  }

  _leerDimensiones() {
    return {
      ancho: parseInt(this.inAncho.value) || 380,
      alto:  parseInt(this.inAlto.value)  || 500
    };
  }

  mostrar() {
    const carta = this.generador.generar();
    const { ancho, alto } = this._leerDimensiones();
    this.renderizador.renderizar(carta, ancho, alto);
  }

  _ajustarCarta() {
    const el = document.querySelector("#caja-carta .carta");
    if (!el) return;
    const { ancho, alto } = this._leerDimensiones();
    el.style.width    = `${ancho}px`;
    el.style.height   = `${alto}px`;
    el.style.fontSize = `${Math.round(alto / this.renderizador.factorTexto)}px`;
    // ajusta pintas
    el.querySelectorAll(".simbolo").forEach(s => {
      s.style.fontSize = `${Math.round(alto / this.renderizador.factorSimbolo)}px`;
    });
  }
}

window.onload = () => new GestorCartasApp();
