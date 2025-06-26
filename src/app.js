import "bootstrap";
import "./style.css";


class Carta {
  constructor(valor, palo) {
    this.valor = valor;
    this.palo  = palo;
  }
}


class IGeneradorCartas {
  generar() { throw "No implementado"; }
}


class GeneradorCartasAleatorio extends IGeneradorCartas {
  constructor() {
    super();
    this._valores = [
      "2","3","4","5","6","7","8","9","10",
      "J","Q","K","A"
    ];
    this._palos = ["corazones","diamantes","treboles","picas"];
  }
  generar() {
    const valor = this._valores[
      Math.floor(Math.random() * this._valores.length)
    ];
    const palo = this._palos[
      Math.floor(Math.random() * this._palos.length)
    ];
    return new Carta(valor, palo);
  }
}


class IDimensionadorCartas {
  obtener() { throw "No implementado"; }
}


class DimensionadorUsuario extends IDimensionadorCartas {
  constructor(idAncho, idAlto) {
    super();
    this._inAncho = document.getElementById(idAncho);
    this._inAlto  = document.getElementById(idAlto);
  }
  obtener() {
    const ancho = parseInt(this._inAncho.value) || 380;
    const alto  = parseInt(this._inAlto.value)  || 500;
    return { ancho, alto };
  }
}


class IRenderizadorCartas {
  renderizar(carta) { throw "No implementado"; }
}

class DOMRenderizadorCartas extends IRenderizadorCartas {
  constructor(selectorContenedor, dimensionador) {
    super();
    this._contenedor    = document.querySelector(selectorContenedor);
    this._dimensionador = dimensionador;
  }
  renderizar(carta) {
    // limpia
    this._contenedor.innerHTML = "";
    // dimensiones
    const { ancho, alto } = this._dimensionador.obtener();
    // crea carta
    const eCarta = document.createElement("div");
    eCarta.classList.add("carta", carta.palo);
    eCarta.style.width  = ancho + "px";
    eCarta.style.height = alto  + "px";
    // símbolos
    const sup = document.createElement("div");
    sup.classList.add("simbolo", "superior");
    sup.textContent = this._simbolo(carta.palo);

    const inf = document.createElement("div");
    inf.classList.add("simbolo", "inferior");
    inf.textContent = this._simbolo(carta.palo);
    // valor central
    const val = document.createElement("span");
    val.textContent = carta.valor;
    // monta
    eCarta.append(sup, val, inf);
    this._contenedor.appendChild(eCarta);
  }
  _simbolo(palo) {
    switch (palo) {
      case "corazones":  return "♥";
      case "diamantes":  return "♦";
      case "treboles":   return "♣";
      case "picas":      return "♠";
      default:           return "";
    }
  }
}


class TemporizadorCartas {
  constructor(intervalo, fn) {
    this._intervalo = intervalo;
    this._fn        = fn;
    this._id        = null;
  }
  iniciar() {
    if (!this._id) this._id = setInterval(this._fn, this._intervalo);
  }
  detener() {
    if (this._id) {
      clearInterval(this._id);
      this._id = null;
    }
  }
}


window.onload = () => {
  const generador     = new GeneradorCartasAleatorio();
  const dimensionador = new DimensionadorUsuario("ancho-carta","alto-carta");
  const renderizador  = new DOMRenderizadorCartas("#caja-carta", dimensionador);

  const btnNueva = document.getElementById("boton-nueva-carta");
  const btnTimer = document.getElementById("boton-temporizador");
  const temporizador = new TemporizadorCartas(10000, mostrarCarta);

  function mostrarCarta() {
    const carta = generador.generar();
    renderizador.renderizar(carta);
  }


  mostrarCarta();

 
  btnNueva.addEventListener("click", mostrarCarta);

  btnTimer.addEventListener("click", () => {
    temporizador.iniciar();
    btnTimer.disabled = true;
    btnTimer.textContent = "Temporizador ON";
  });


  ["ancho-carta","alto-carta"].forEach(id => {
    document.getElementById(id)
      .addEventListener("input", () => {
        const ultima = document.querySelector("#caja-carta .carta");
        if (!ultima) return;
        const { ancho, alto } = dimensionador.obtener();
        ultima.style.width  = ancho + "px";
        ultima.style.height = alto  + "px";
      });
  });
};
