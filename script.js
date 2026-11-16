const slides = document.querySelectorAll('.slide');
const thumbs = document.querySelectorAll('header nav > a[href^="#slide"]');
const btnProximo = document.querySelector('.proximo');
const btnAnterior = document.querySelector('.anterior');
const nome = document.querySelector('#slide-1 #nome');
const personagem = document.querySelector('#slide-1 #personagem');
const carregamento = document.querySelector('#carregamento');

let indexAtual = 0;
const totalSliders = slides.length;

function mostrarSlide(index) {
    // Volta ao início depois do último e ao último antes do primeiro
    indexAtual = (index + totalSliders) % totalSliders;

    slides.forEach(slide => {
        slide.classList.remove('ativo');
    });

    slides[indexAtual].classList.add('ativo');
    // Destaca a thumbnail correspondente no header
    thumbs.forEach((thumb, i) => {
        thumb.classList.toggle('ativo', i === indexAtual);
    });
}

// Clique nas thumbnails do header
thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSlide(i);
    });
});

// Setas anterior / próximo
btnProximo.addEventListener('click', () => {
    mostrarSlide(indexAtual + 1);
});

btnAnterior.addEventListener('click', () => {
    mostrarSlide(indexAtual - 1);
});

function escolherPersonagem(nomePersonagem, imagemPersonagem, cor) {
    nome.textContent = nomePersonagem;
    personagem.src = imagemPersonagem;
    nome.style.color = cor;
}

async function lerFoto(input) {
    const foto = input.files[0];

    if (!foto) {
        return;
    }

    const leitor = new FileReader();
    leitor.readAsDataURL(foto);

    leitor.onload = async function () {
        carregamento.hidden = false;

        try {
            const desenho = await puter.ai.txt2img({
                prompt: "A medium shot video game character sprite based on the provided face. High quality, realistic facial fidelity. Visual style features: very bold, thick black outlines. Vibrant, highly saturated colors. Cel-shaded art style. Isolated on a perfectly pure transparent background, with no background elements, no floor, and absolutely no shadows.",
                model: "replicate:openai/gpt-image-2.5-flare",
                quality: "medium",
                provider:"openai",
                providerOptions: {background: "transparent"},
                output_format: "png",
                input_image: leitor.result,
                input_image_mime_type: foto.type
            });

            escolherPersonagem('você', desenho.src, '#d7b010');
        } catch (erro) {
            console.error('Não foi possível gerar a imagem:', erro);
            alert(erro?.message || 'Não foi possível gerar a imagem. Verifique o console para mais detalhes.');
        } finally {
            carregamento.hidden = true;
        }
    };

    leitor.onerror = function () {
        console.error('Não foi possível ler a imagem selecionada.');
        alert('Não foi possível ler a imagem selecionada.');
    };
}
