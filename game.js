console.log("Flappy Bird Game :3");

let frames = 0;

const som_HIT = new Audio();
som_HIT.src = "./sounds/hit.wav";
som_HIT.currentTime = 0;

const som_PULO = new Audio();
som_PULO.src = "./sounds/pulo.wav";
som_PULO.currentTime = 0;

const som_PONTO = new Audio();
som_PONTO.src = "./sounds/ponto.wav";
som_PONTO.currentTime = 0;

const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector("canvas");
const contexto = canvas.getContext("2d");

// Função que verifica uma colisão entre 2 objetos
function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if (flappyBirdY - 1 >= chaoY) {
    return true;
  }

  return false;
}

// Função que retorna um Flappy Bird
function criaFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    velocidade: 0,
    gravidade: 0.25,
    pulo: 4.6,
    frameAtual: 0,

    atualizaFrame() {
      const intervaloDeFrames = 10;
      const passouIntervalo = frames % intervaloDeFrames === 0;

      if (passouIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + this.frameAtual;
        const baseRepeticao = this.movimentos.length;
        this.frameAtual = incremento % baseRepeticao;
      }
    },
    desenha() {
      this.atualizaFrame();
      const { spriteX, spriteY } = this.movimentos[this.frameAtual];

      contexto.drawImage(
        sprites,
        spriteX,
        spriteY,
        this.largura,
        this.altura,
        this.x,
        this.y,
        this.largura,
        this.altura
      );
    },
    atualiza() {
      if (fazColisao(flappyBird, globais.chao)) {
        som_HIT.play();
        mudaTela(telas.GAME_OVER);
        return;
      }

      this.velocidade = this.gravidade + this.velocidade;
      this.y = this.y + this.velocidade;
    },
    movimentos: [
      { spriteX: 0, spriteY: 0 }, // asa pra cima
      { spriteX: 0, spriteY: 26 }, // asa no meio
      { spriteX: 0, spriteY: 52 }, // asa pra baixo
      { spriteX: 0, spriteY: 26 }, // asa no meio
    ],
    pula() {
      som_PULO.play();
      this.velocidade = -this.pulo;
    },
  };

  return flappyBird;
}

// Função que retorna o Chão do jogo
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,

    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = this.largura / 2;
      const movimentacao = this.x - movimentoDoChao;

      this.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        this.spriteX,
        this.spriteY,
        this.largura,
        this.altura,
        this.x,
        this.y,
        this.largura,
        this.altura
      );

      contexto.drawImage(
        sprites,
        this.spriteX,
        this.spriteY,
        this.largura,
        this.altura,
        this.x + this.largura,
        this.y,
        this.largura,
        this.altura
      );
    },
  };

  return chao;
}

// Plano de fundo do jogo
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,

  desenha() {
    contexto.fillStyle = "#70c5ce";
    contexto.fillRect(0, 0, canvas.width, canvas.height);

    contexto.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.largura,
      this.altura,
      this.x,
      this.y,
      this.largura,
      this.altura
    );

    contexto.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.largura,
      this.altura,
      this.x + this.largura,
      this.y,
      this.largura,
      this.altura
    );
  },
};

// Função que retorna os Canos do jogo
function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    desenha() {
      canos.pares.forEach(function (par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;

        const canoCeuX = par.x;
        const canoCeuY = yRandom;

        // [Cano do Céu]
        contexto.drawImage(
          sprites,
          canos.ceu.spriteX,
          canos.ceu.spriteY,
          canos.largura,
          canos.altura,
          canoCeuX,
          canoCeuY,
          canos.largura,
          canos.altura
        );

        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
        contexto.drawImage(
          sprites,
          canos.chao.spriteX,
          canos.chao.spriteY,
          canos.largura,
          canos.altura,
          canoChaoX,
          canoChaoY,
          canos.largura,
          canos.altura
        );

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY,
        };
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY,
        };
      });
    },
    temColisaoComOFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

      if (globais.flappyBird.x + globais.flappyBird.largura - 8 >= par.x) {
        if (cabecaDoFlappy + 8 <= par.canoCeu.y) {
          return true;
        }

        if (peDoFlappy - 8 >= par.canoChao.y) {
          return true;
        }
      }
      return false;
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if (passou100Frames) {
        // console.log('Passou 100 frames');
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      canos.pares.forEach(function (par) {
        par.x = par.x - 2;

        if (canos.temColisaoComOFlappyBird(par)) {
          som_HIT.play();
          mudaTela(telas.GAME_OVER);
        }

        if (par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });
    },
  };

  return canos;
}

function criaPlacar() {
  const placar = {
    pontuacao: 0,

    desenha() {
      contexto.font = "40px VT323";
      contexto.fillStyle = "white";
      contexto.strokeStyle = "black";
      contexto.lineWidth = 5;
      contexto.strokeText(`${this.pontuacao}`, canvas.width - 10, 36);
      contexto.textAlign = "right";
      contexto.fillText(`${this.pontuacao}`, canvas.width - 10, 35);
    },
    atualiza() {
      if (frames >= 148) {
        const intervaloDeFrames = 100;
        const passouIntervalo = frames % intervaloDeFrames === 0;

        if (passouIntervalo) {
          som_PONTO.play();
          placar.pontuacao = placar.pontuacao + 1;
        }
      }
    },
  };

  return placar;
}

const globais = {};
let telaAtiva = {};

function mudaTela(novaTela) {
  telaAtiva = novaTela;

  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.flappyBird.desenha();

      globais.chao.desenha();
      telaDeInicio.desenha();
    },
    click() {
      mudaTela(telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    },
  },
};

telas.JOGO = {
  inicializa() {
    frames = 0;
    globais.placar = criaPlacar();
  },
  desenha() {
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.placar.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
    globais.placar.atualiza();
  },
};

const telaDeGameOver = {
  spriteX: 134,
  spriteY: 153,
  largura: 226,
  altura: 200,
  x: canvas.width / 2 - 226 / 2,
  y: 50,

  desenha() {
    contexto.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.largura,
      this.altura,
      this.x,
      this.y,
      this.largura,
      this.altura
    );
  },
};

telas.GAME_OVER = {
  desenha() {
    telaDeGameOver.desenha();
  },
  atualiza() {},
  click() {
    mudaTela(telas.INICIO);
  },
};

const telaDeInicio = {
  spriteX: 134,
  spriteY: 0,
  largura: 174,
  altura: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,

  desenha() {
    contexto.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.largura,
      this.altura,
      this.x,
      this.y,
      this.largura,
      this.altura
    );
  },
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames++;
  requestAnimationFrame(loop);
}

canvas.addEventListener("click", () => {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaTela(telas.INICIO);
loop();
