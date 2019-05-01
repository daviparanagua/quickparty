# Multichat

Uma aplicação de chat rápida e simples, com suporte a salas.

## Visão Geral
O **Multichat** é uma ferramenta completa de chat baseada em node.js e interface construída no framework Quasar, baseado em Vue.js. Possui suporte a múltiplas salas de chat, bastando apenas incluir o nome da sala desejada na URL na forma www.seusite.com.br/**nomedasala**. Também possui uma interface básica e extensível de administração, possibilitando monitorar as salas e usuários ativos.

## Instalação
O projeto possui backend e frontend separados por pastas, devendo ser instalados e executados separadamente. Como, por padrão, funcionam em diferentes portas, podem ser instalados num mesmo servidor.

### Backend
Primeiro, instale as dependências do projeto de backend:

    cd backend
    npm install

Em seguida, rode o comando abaixo para iniciá-lo:

    npm run start

Pronto! O servidor já está iniciado na porta 3000 e pronto para receber requisições.

### Frontend
Primeiro, instale as dependências do projeto de frontend:

    cd frontend
    npm install
    npm install -g @quasar/cli

Em seguida, rode o comando abaixo para iniciá-lo:

    quasar dev

Pronto! Abra seu navegador e aponte para a porta 8080 do servidor ou localhost.

## Usando o Multichat
### Entrar em sala
Para criar ou entrar numa sala existente, digite o nome da sala na url, como http://localhost:8080/minha_sala.

### Escolher um nome de usuário
Você deverá escolher um nome ao entrar na sua primeira sala. Para alterá-lo, em qualquer sala, clique no seu nome na lista de participantes (ele estará em azul), digite um novo nome e aperte ENTER.

## Administrar o Multichat
Para entrar na interface de administrador, acesse a rota /admin/admin.
O painel de administração é protegido por senha. A senha padrão é `senhasecreta`. Você pode (e deve) alterar esta senha diretamente no arquivo /socket/index.js, na pasta backend.

## Alerta de segurança
Este projeto é apenas um exercício. Utilize-o como aprendizado, para diversão ou a base de um projeto mais interessante. De todo modo, é importante saber que ele possui pontos frágeis e **não deve ser utilizado da forma como está em produção**.
Se você ainda está aprendendo e tem dúvidas sobre o que está errado, cito algumas falhas que este projeto contém:

 - Há uma senha de administrador padrão que está no próprio código, disponível aqui. Além disso, não há qualquer proteção contra ataques de força bruta à senha de administrador.
 - O secret dos tokens jwt estão presentes no próprio código, que também possui um padrão visível no código. Num cenário real, você não irá querer deixar seu segredo no código publicado no controle de versão.
 - Para efeito de simplicidade na instalação e execução, este chat não utiliza nenhum banco de dados e guarda todos os seus dados na memória. Isto, a longo prazo, fará com que a memória do servidor se esgote, causando problemas ou reiniciando o servidor. Também, por estarem apenas na memória, todos os dados serão perdidos ao reiniciar o servidor.
