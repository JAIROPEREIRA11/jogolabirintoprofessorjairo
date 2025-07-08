# jogo labirinto Professor Jairo
# 🧱 Labirinto do Conhecimento

Bem-vindo ao **Labirinto do Conhecimento**, um jogo online multiplayer educacional onde você caminha por um mundo em blocos, encontra colegas e responde perguntas para desbloquear fases!

---

## 🎮 Como Jogar

1. Acesse o jogo pelo link do GitHub Pages fornecido pelo professor.
2. Digite seu nome e escolha seu avatar.
3. Clique em **"Entrar"** para entrar no labirinto.
4. Use as teclas:
   - `W` = andar para frente
   - `A` = esquerda
   - `S` = para trás
   - `D` = direita
   - Mouse para olhar ao redor
5. Explore o labirinto! Ao encontrar **portas ou blocos especiais**, você receberá uma **pergunta**.
6. Responda corretamente para abrir o caminho e continuar avançando.
7. Você verá **outros jogadores online** com nome e avatar.
8. Ao final, veja seu **desempenho** e compare com os colegas!

---

## 🧑‍🏫 Conteúdo Educacional

As perguntas envolvem temas da área de Administração, como:

- Finanças
- Marketing
- Empreendedorismo
- Logística
- Atualidades e conceitos de gestão

---

## 🛠️ Como editar as perguntas

As perguntas estão no arquivo `questions.json`.  
Você pode adicionar, remover ou editar livremente.  
Exemplo de estrutura:

```json
{
  "pergunta": "O que é fluxo de caixa?",
  "alternativas": ["Controle de estoque", "Registro de entradas e saídas financeiras", "Planejamento de marketing", "Processo de recrutamento"],
  "resposta": 1
}
