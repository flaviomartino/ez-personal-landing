# Política de Privacidade do site: menores contraditórios e seções que faltam para o app do aluno

**Data:** 08/10/2026 · **Status:** enviado à Safie no tíquete SAFIEDesk #2796 · **Bloqueia:** mesclar o PR #2 e mandar o app do aluno (ez-companion#1) para a revisão da Google Play.

## O que está errado

1. **Menores de idade, regra contraditória.** `privacidade.html:111` (seção 10) e `termos.html:65` dizem que o personal pode cadastrar aluno menor com autorização do responsável legal. A regra interna em vigor é outra: o personal **não** conecta aluno menor de 18 no app do aluno até a Safie responder sobre a LGPD, art. 14.
2. **Seções que faltam.** O app do aluno (`ez-companion`, Health Connect) e o app do personal abrem `https://<API_HOST>/privacidade`, que aponta para esta política (`ez-companion` `MainActivity.kt:119-121`). A política não fala de: Health Connect (dados lidos, finalidade, guarda, como revogar), token de notificação do app do personal, exclusão de conta sem login (`/excluir-conta`), Strava (consentimento e guarda de 7 dias, em produção desde 07/10) e anúncios do treino grátis.

## Como foi verificado

```sh
gh pr checkout 2 -R flaviomartino/ez-personal-landing
grep -n -i 'menor' privacidade.html termos.html
for k in 'Health Connect' 'push' 'excluir' 'Strava'; do printf '%s: ' "$k"; grep -ci "$k" privacidade.html; done
# Health Connect: 0 · push: 0 · excluir: 0 · Strava: 1 (só na lista de fornecedores)
```

## O que quebra se não for corrigido

- A Google Play exige que a política, a tela de consentimento do app e o formulário do Health Connect digam a mesma coisa. Sem a seção, a revisão do app do aluno é recusada.
- O site publicado afirmaria aceitar menores, contra a regra vigente.

## O que fazer

- Esperar a resposta da Safie (tíquete #2796, itens 1 a 3 do documento "Demandas jurídicas de outubro de 2026").
- Rascunho das seções que faltam: Anexo A do mesmo documento (https://claude.ai/code/artifact/5c4d7d83-08f3-4f31-a99d-f5de083db133).
- Até a resposta, a seção 10 deve dizer que a plataforma não aceita alunos menores de 18 anos (proposta, a confirmar pela Safie).
- Registrar aqui a decisão dela antes de mesclar o PR #2.
