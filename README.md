# FCBCR 2026 - Campeonato Catarinense de Basquetebol em Cadeira de Rodas

Portal oficial da Federação Catarinense de Basquetebol em Cadeira de Rodas (FCBCR) para o Campeonato Catarinense 2026.

## Funcionalidades

- Portal público com classificação, resultados, calendário e cestinhas
- Painel administrativo para gestão de jogos, equipes, atletas, profissionais e escalas
- Geração de PDF para escalas de jogos
- Sistema de súmulas com pontuação individual por atleta
- Netlify Functions para backend serverless

## Estrutura

```
fcbcr-2026/
├── netlify/
│   └── functions/        # Backend serverless
│       ├── auth.js       # Autenticação
│       ├── jogos.js      # Jogos
│       ├── equipes.js    # Equipes
│       ├── atletas.js    # Atletas
│       ├── profissionais.js  # Profissionais (árbitros, etc)
│       ├── escalas.js    # Escalas de jogo
│       ├── classificacao.js  # Classificação
│       ├── artilharia.js # Artilharia
│       └── usuarios.js   # Usuários admin
├── public/
│   ├── index.html        # Portal público
│   ├── admin.html        # Painel administrativo
│   ├── css/
│   │   └── estilo.css    # Estilos globais
│   ├── js/
│   │   ├── api.js        # Camada de API
│   │   ├── ui.js         # Helpers de UI
│   │   ├── dashboard.js  # Dashboard público
│   │   └── admin.js      # Lógica administrativa
│   └── logos/            # Logos das equipes
├── netlify.toml          # Configuração Netlify
├── package.json
└── README.md
```

## Deploy

### Via Netlify CLI
```bash
npm install
npx netlify login
npx netlify deploy --prod
```

### Via Git (recomendado)
1. Crie um repositório no GitHub
2. Faça push do código
3. Importe o site no Netlify apontando para o repositório
4. Configurações de build são automáticas via `netlify.toml`

## Acesso Admin

- URL: `/admin.html`
- Usuários padrão:
  - **admin** / FCBCR2026 (Administrador)
  - **gestor** / gestor2026 (Gestor)
  - **escalador** / escala2026 (Escalador)

## Tecnologias

- Frontend: HTML5, Tailwind CSS, JavaScript vanilla
- Backend: Netlify Functions (Node.js)
- Hospedagem: Netlify

## Equipes Participantes

| Equipe | Cidade |
|--------|--------|
| CEPE/Raposas do Sul/Sesporte | Joinville |
| APEDEB/FME BRUSQUE/CLASSE MÓVEIS | Brusque |
| ÁGUIAS/SESPORT CONCÓRDIA | Concórdia |
| Spartacus/SESC/Sec. Esp. e Lazer/Caçador | Caçador |
| AFLODEF/OMDA/FMEFLORIPA | Florianópolis |
| Tigres Sobre Rodas/FME Criciúma | Criciúma |

---

© 2026 FCBCR - Todos os direitos reservados
