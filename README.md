# autou-email-classifier

Bem vindo ao classificador de emails. O objetivo desse projeto é classificar um email como produtivo ou improdutivo tendo base a urgencia das açoes que nele estão.
Nesse documento você encontra as instruções para acessar o aplicativo ou configurar você mesmo em sua máquina

## Acessando o aplicativo pronto

Para acessar o app é simples clique [aqui](https://autou-email-classifier-n8zz.onrender.com/)

**Atenção** por se tratar de uma hospedagem gratuita é possível que haja um intervalo grande antes do site abrir, não se preocupe isso acontece apenas uma vez

## Quero acessar direto do meu computador

Para usar o aplicativo direto do seu computador você pode clonar esse repositório com o commando: \
`git clone https://github.com/lucaslmeireles/autou-email-classifier.git`

Para usar esse app você precisa instalar o gerenciador de pacotes uv, para isso siga os passos

- Identifique o seu sistema operacional
  - Windows \
    Cole o seguinte comando no seu terminal \
    `winget install --id=astral-sh.uv  -e`
  - Mac e Linux \
    Cole o seguinte comando no seu terminal \
    `curl -LsSf https://astral.sh/uv/install.sh | sh`

Caso nenhuma dessas instalações forem possiveis, voce pode encontrar outras maneiras no
[link](https://docs.astral.sh/uv/getting-started/installation/#__tabbed_1_1)

---

## Rodando a aplicação localmente

Com o uv instalado, entre na pasta do projeto clonado
Siga os comandos

```
    cd backend
    uv sync
```

Crie sua chave no OpenRouter, entre no site [OpenRouter](https://openrouter.ai/), e crie sua conta.\
Crie uma chave usando o link [Criar sua chave](https://openrouter.ai/settings/keys)

Crie um arquivo .env dentro da pasta backend, seguindo o exemplo do .env.example e cole sua chave

Agora rode o comando

```
cd backend
uv run fastapi dev main.py
```

Para acessar o aplicativo entra na url http://127.0.0.1:8000/
