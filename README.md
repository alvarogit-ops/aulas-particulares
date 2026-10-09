# 📚 App de Aulas Particulares — Cliente Web (React)

Aplicação web desenvolvida em **React** para o agendamento de aulas particulares de reforço escolar e acadêmico. O sistema atende tanto responsáveis/alunos quanto administradores da instituição através da integração com a **API de Agendamentos**.

---

## 🚀 Sobre o Projeto

O **App de Aulas Particulares** permite que responsáveis agendem aulas para seus filhos (ou que adultos agendem para si próprios), escolhendo disciplinas, professores e horários disponíveis. O perfil **Administrador** gerencia os professores, as disciplinas oferecidas, a grade de horários e toda a agenda de solicitações.

### 👥 Perfis de Usuário
- **Responsável / Aluno (`Cliente`):** Consulta professores e disciplinas, realiza agendamentos, acompanha status das aulas, cancela e avalia o atendimento recebido.
- **Administrador (`Administrador`):** Configura os dados da instituição, cadastra e edita professores (recursos) e disciplinas (serviços), gerencia horários de atendimento, e aprova/conclui/cancela agendamentos.

> **Mapeamento de Termos (App vs. API):**
> - **Escola de Reforço** = Organização (`aulas-particulares`)
> - **Professor** = Recurso
> - **Disciplina / Aula** = Serviço
> - **Horários Atendidos** = Disponibilidades
> - **Aula Agendada** = Agendamento

---

## 🛠️ Tecnologias Utilizadas

- **[React](https://react.dev/)** `^19.2.8` — Biblioteca principal para construção da interface.
- **[Vite](https://vitejs.dev/)** `^8.3.0` — Build tool rápida para desenvolvimento.
- **[React Router DOM](https://reactrouter.com/)** `^7.18.4` — Roteamento de páginas e navegação por permissões.
- **[Bootstrap](https://getbootstrap.com/)** `^5.3.8` & **[React Bootstrap](https://react-bootstrap.github.io/)** — Estilização e componentes de UI responsivos.
- **[Bootstrap Icons](https://icons.getbootstrap.com/)** — Ícones da interface.
- **[Oxlint](https://oxc-project.github.io/)** — Linter ultrarrápido para garantia de qualidade do código.

---

## 📐 Estrutura de Telas e Navegação

A navegação da aplicação é orientada dinamicamente pelas permissões retornadas no endpoint `/auth/eu/` (`api.change_organizacao`).

| ID | Tela | Perfil | Descrição Principal |
|----|------|--------|---------------------|
| **E1** | Entrada | Todos | Apresentação da marca, login e cadastro |
| **E2** | Cadastro | Todos | Criação de conta para novos responsáveis/alunos |
| **E3** | Login | Todos | Autenticação com e-mail e senha |
| **E4** | Esqueci minha senha | Todos | Solicitação de link de redefinição via e-mail |
| **E5** | Meu Perfil | Todos | Edição de nome, foto de perfil e logout |
| **E6** | Alterar Senha | Todos | Atualização de senha do usuário logado |
| **C1–C6** | Fluxo de Agendamento | Cliente | Seleção de disciplina, professor, data/horário e confirmação |
| **C7–C9** | Aulas e Avaliação | Cliente | Acompanhamento do status das aulas, cancelamento e avaliação (1 a 5 estrelas) |
| **C10–C11** | Professores | Cliente | Visualização do perfil, bio e avaliações do professor |
| **A1–A3** | Gestão da Agenda | Admin | Visão da agenda diária, aprovação, conclusão e cancelamento de aulas |
| **A4–A9** | Cadastros | Admin | Gestão da instituição, professores, horários e disciplinas |
| **A10** | Avaliações | Admin | Monitoramento das notas e feedbacks recebidos |

---

## 🔄 Fluxo do Agendamento e Regras de Negócio

1. **Ciclo de Vida do Agendamento:**
   ```text
   [solicitado] ──(Admin confirma)──> [confirmado] ──(Admin conclui)──> [concluido] ──(Aluno avalia)
        │                                  │
        └───────(Aluno/Admin cancela)──────┴──> [cancelado]

2. **Capacidade & Concorrência:**
* A API limita o número de alunos simultâneos conforme a `capacidade` do professor.
* O mesmo responsável não pode agendar aulas com horários sobrepostos para dependentes diferentes na mesma conta.


3. **Mapeamento de Erros:**
* **400:** Erros de validação em formulários e regras do agendamento.
* **401:** Tentativa de renovação do token via `refresh`. Se expirado, redireciona para o login.
* **403:** Mensagem de restrição para ações não permitidas.
* **429:** Alerta de excesso de requisições.



---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos

* Node.js (versão 18 ou superior)
* Gerenciador de pacotes `npm` ou `yarn`

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone [https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git](https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git)
cd SEU-REPOSITORIO

```


2. **Instale as dependências:**
```bash
npm install

```


3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev

```


Acesse o endereço exibido no terminal (geralmente `http://localhost:5173`).
4. **Executar o Linter (Oxlint):**
```bash
npm run lint

```



---

## 🌐 Deploy e Homologação

O projeto está configurado para deploy contínuo na plataforma **Vercel**.

* **URL de Produção:** `https://aulas-particulares-six.vercel.app/login`
* **Base URL da API:** `https://agendamentos.spaincentral.cloudapp.azure.com/api`
* **Documentação Swagger:** [Acessar Swagger API](https://agendamentos.spaincentral.cloudapp.azure.com/api/docs/)

---

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos sob a licença MIT.

**Professor Responsável:** Prof. Diego Cirilo — IFRN

**Disciplina:** Programação Orientada a Serviços
