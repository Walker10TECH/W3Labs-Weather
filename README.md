# 🌤️ W3Labs Weather

> **Aplicativo de previsão do tempo premium para Android, iOS e Web — com telas dedicadas interativas e Calendário Lunar Agrícola para Produtores Rurais e Agricultura Familiar.**

---

## 📱 Visão Geral

O **W3Labs Weather** é um aplicativo móvel desenvolvido com **Expo / React Native** que vai muito além de um simples app de clima. Cada informação meteorológica possui uma **tela dedicada e interativa** com simuladores, gráficos, calculadoras e guias práticos. O app consome dados reais da **API Open-Meteo** (gratuita, sem chave) e inclui um exclusivo **Calendário Lunar Agrícola** voltado para produtores rurais e agricultura familiar.

---

## 🚀 Como Executar

### Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js | >= 18 |
| Expo CLI | Expo SDK 57 |
| Android Studio / Expo Go | Qualquer versão recente |
| iOS Simulator / Expo Go | Xcode 15+ |

### Instalação

```bash
# Clone o projeto
git clone <repo-url>
cd W3Labs-Weather

# Instale as dependências (sempre use expo install)
npx expo install

# Inicie o servidor de desenvolvimento
npx expo start
```

### Executar em dispositivos

```bash
# Android
npx expo start --android

# iOS
npx expo start --ios

# Web (modo responsivo desktop)
npx expo start --web
```

Após iniciar, escaneie o **QR Code** com o **Expo Go** no seu celular Android ou iOS.

---

## 🗂️ Estrutura do Projeto

```
W3Labs-Weather/
├── App.tsx                        # Raiz: layout responsivo + modais globais
├── src/
│   ├── components/
│   │   ├── background/            # AtmosphericBackground (animações)
│   │   ├── city/                  # CitySearchModal
│   │   ├── details/               # 11 telas de detalhe interativas
│   │   ├── header/                # AppHeader + HeroSummaryWidget
│   │   ├── lunar/                 # LunarAgricultureModal
│   │   └── widgets/               # 12 widgets do bento grid + WidgetCard
│   ├── hooks/
│   │   └── useWeather.ts          # Hook principal de dados
│   ├── services/
│   │   ├── weatherApi.ts          # Consumo da API Open-Meteo
│   │   ├── weatherUtils.ts        # Utilidades de conversão e cálculo
│   │   ├── mockData.ts            # Dados simulados (fallback)
│   │   └── lunarAgricultureData.ts# Base de dados lunar + crops
│   ├── theme/
│   │   └── fonts.ts               # Tokens de fontes Nokia Pure Headline
│   └── types/
│       └── weather.ts             # Tipos TypeScript
└── assets/
    └── fonts/                     # Nokia Pure Headline (ultra, light, regular, bold)
```

---

## 📐 Layout Responsivo

O app se adapta automaticamente a qualquer tamanho de tela:

| Dispositivo | Layout |
|-------------|--------|
| Celular Retrato (< 768px) | **Coluna única** — scroll contínuo |
| Celular Paisagem (< 900px) | **2 colunas** — painel esquerdo fixo |
| Tablet / Desktop (>= 1024px) | **Split layout** — coluna esquerda 380px + área de grid |
| 4K / Ultra-wide (>= 1400px) | **Grid 4 colunas** nos widgets |

---

## 🖥️ Telas e Funcionalidades

### 1. 🏠 Tela Principal (Home)

A tela inicial é composta por três seções empilhadas em modo retrato ou divididas em dois painéis no modo paisagem/desktop.

#### 📍 Barra de Controles (Header)

Localizada no topo da tela, contém:

| Botão | Ícone | Função |
|-------|-------|--------|
| **Buscar Cidades** | Lupa | Abre a busca de cidades |
| **GPS** | Mira | Detecta localização atual via GPS |
| **Calendário Lunar** | Folha verde | Abre o Calendário Lunar Agrícola |
| **°C / °F** | Texto | Alterna entre Celsius e Fahrenheit |
| **Atualizar** | Seta circular | Recarrega os dados meteorológicos |

---

#### 🌡️ Painel Hero (Temperatura Principal)

O painel central exibe as informações mais importantes do clima atual:

- **Nome da cidade** com ícone de localização (GPS ou pino de mapa)
  - Toque para abrir a busca de cidades
- **Temperatura atual** em fonte ultra-leve tamanho grande
- **Condição do tempo** (ex: "Parcialmente Nublado", "Chuva Forte")
- **Temperatura Máxima** e **Mínima** do dia
- **Sensação Térmica** calculada pelo Heat Index ou Wind Chill
- **Banner de Alerta Meteorológico** (quando disponível) — toque para ver a previsão horária

---

#### ⏱️ Previsão Horária (24h)

Widget horizontal com scroll, mostrando hora a hora:

- Ícone de condição do tempo
- Temperatura
- Probabilidade de chuva (%)
- Marcadores especiais de **Nascer** e **Pôr do Sol**

**Toque no widget** para abrir a tela de Previsão Horária Interativa.

---

#### 📅 Previsão de 10 Dias

Lista vertical com cada dia exibindo:

- Nome do dia e data
- Ícone de condição
- Temperaturas máxima e mínima
- Probabilidade de chuva
- UV máximo do dia

**Toque no widget** para abrir a tela de Previsão de 10 Dias Interativa.

---

#### 🧩 Bento Grid de Widgets

Grade de cards interativos (2 colunas em celular, até 4 em desktop). Cada card possui:
- Ícone + título categorizado
- Valor principal destacado
- Informação secundária
- Seta (>) indicando que há uma tela dedicada

**Toque em qualquer widget** para abrir sua tela de detalhes interativa.

---

### 2. 🔍 Busca de Cidades

**Como acessar:** Botão de lupa no header **ou** tocar no nome da cidade no painel Hero.

#### Funcionalidades

- **Campo de busca** com debounce de 350ms — busca automática ao digitar
- Integração com a **API Open-Meteo Geocoding** para busca real de cidades
- Lista de **Cidades Salvas** com checkmark na cidade atual
- Botão **"Usar minha localização GPS"** — solicita permissão e usa reverse geocoding
- Indicador de carregamento durante a busca

#### Como usar

1. Toque na lupa no header ou no nome da cidade
2. Digite ao menos **2 caracteres** da cidade desejada
3. Aguarde os resultados aparecerem automaticamente
4. Toque em uma cidade para selecioná-la
5. Os dados climáticos são atualizados instantaneamente

> **Dica:** O app inclui cidades brasileiras pré-carregadas como São Paulo, Rio de Janeiro, Brasília, Manaus, Curitiba, Salvador, Florianópolis e Porto Alegre.

---

### 3. ☀️ Tela: Índice UV & Proteção Solar

**Como acessar:** Toque no widget **"Índice UV"** no bento grid.

#### Seção 1 — Hero UV
- Valor atual do índice UV em destaque grande
- Categoria de risco (Baixo, Moderado, Alto, Muito Alto, Extremo) com cor correspondente
- Conselho geral de proteção

#### Seção 2 — Calculadora de Tempo Seguro ao Sol
Simulador interativo com **tipo de pele** e **FPS do protetor solar**:

| Tipo de Pele | Sensibilidade |
|-------------|---------------|
| Clara (Fitzpatrick I-II) | Mais sensível |
| Morena Clara (III) | Média sensibilidade |
| Morena Escura (IV-V) | Menos sensível |
| Negra (VI) | Menor sensibilidade |

Como usar:
1. Toque no seu tipo de pele
2. Toque no FPS do protetor que você usa (0, 30, 50 ou 70)
3. O app calcula o tempo estimado até o eritema (queimadura)

#### Seção 3 — Gráfico UV Hora a Hora
- Barras interativas para as próximas 12 horas
- Toque em cada hora para ver o índice UV previsto e uma dica específica

#### Seção 4 — Checklist de Proteção
- Checkboxes tocáveis: Óculos de sol, Protetor solar, Chapéu/boné, Sombra natural
- Contador de itens de proteção ativos

---

### 4. 🌬️ Tela: Vento & Rajadas

**Como acessar:** Toque no widget **"Vento"** no bento grid.

#### Seção 1 — Hero Vento
- **Velocidade sustentada** em km/h ou mph
- **Rajadas máximas** em destaque amarelo
- **Bússola animada** com agulha apontando para a direção real do vento
- Grau de origem e ponto cardeal (N, NE, L, SE, S, SO, O, NO)

#### Seção 2 — Rosa dos Ventos Interativa
- 8 botões de pontos cardeais
- Toque em cada ponto para ver a explicação meteorológica daquele quadrante
- Informações sobre massas de ar e clima associado

#### Seção 3 — Simulador da Escala Beaufort
- 6 níveis (0 a 10) com scroll horizontal
- Cada nível exibe: nome, faixa de velocidade, impacto no ambiente

| Nível | Nome | Faixa |
|-------|------|-------|
| 0 | Calmaria | < 2 km/h |
| 2 | Brisa Leve | 6–11 km/h |
| 4 | Brisa Moderada | 20–28 km/h |
| 6 | Vento Forte | 39–49 km/h |
| 8 | Ventania | 62–74 km/h |
| 10 | Vendaval Violento | > 89 km/h |

#### Seção 4 — Segurança para Atividades ao Ar Livre
Status dinâmico calculado com base no vento atual:
- Voo com Drone
- Ciclismo em Rodovia
- Navegação / Esportes Náuticos
- Guarda-chuva e Tendas

---

### 5. 🌅 Tela: Ciclo Solar & Luz do Dia

**Como acessar:** Toque no widget **"Pôr do Sol"** no bento grid.

#### Seção 1 — Hero Solar
- Horário de Nascer e Pôr do Sol com barra de progresso animada
- Ícone do sol posicionado na barra de acordo com o progresso do dia
- Tempo restante de luz natural

#### Seção 2 — Simulador de Fase da Luz Solar
- Seletor de horas (00h a 23h)
- Toque em qualquer hora para ver a fase da luz e comprimento das sombras

| Fase | Horário | Destaque |
|------|---------|----------|
| Hora Azul | 05h–06h | Tons frios, ideal para arquitetura |
| Hora Dourada Manhã | 07h–08h | Luz quente, perfeita para fotografia |
| Zênite | 11h–13h | UV máximo, sombras verticais |
| Hora Dourada Tarde | 17h | Tons alaranjados, clima ameno |
| Pôr do Sol | 18h | Tons rosa e violeta no céu |

#### Seção 3 — Calendário Sazonal
- Solstícios e Equinócios
- Dias mais longos e curtos do ano
- Cálculo automático para o hemisfério sul

---

### 6. 💨 Tela: Qualidade do Ar (AQI)

**Como acessar:** Toque no widget **"Qualidade do Ar"** no bento grid.

#### Seção 1 — Gauge de AQI
Gauge visual semi-circular com ponteiro colorido:

| Faixa AQI | Categoria | Cor |
|-----------|-----------|-----|
| 0–50 | Excelente | Verde |
| 51–100 | Boa | Amarelo |
| 101–150 | Moderada | Laranja |
| 151–200 | Ruim | Vermelho |
| 201+ | Muito Ruim | Roxo |

#### Seção 2 — Recomendações por Grupo de Saúde
4 perfis interativos — toque para alternar:
- **População Geral** — orientações para o dia a dia
- **Crianças e Idosos** — cuidados especiais
- **Asma, Rinite e Alergias** — alertas para hipersensíveis
- **Atletas e Treinos Externos** — quando treinar ao ar livre

#### Seção 3 — Poluentes Detalhados
Cards expansíveis com informações sobre PM2.5, PM10, CO e NO2.

---

### 7. 🌡️ Tela: Sensação Térmica

**Como acessar:** Toque no widget **"Sensação Térmica"** no bento grid.

#### Seção 1 — Hero Sensação
- Temperatura de sensação atual em destaque
- Diferença em relação à temperatura real
- Explicação do fator dominante (umidade ou vento)

#### Seção 2 — Calculadora Interativa de Sensação Térmica
Simulador físico com 3 variáveis ajustáveis:

| Variável | Faixa | Algoritmo |
|----------|-------|-----------|
| Temperatura | -10°C a 45°C | Rothfusz Heat Index / Wind Chill |
| Umidade | 0% a 100% | Ajuste por pressão de vapor |
| Vento | 0 a 100 km/h | Siple-Passel Wind Chill |

O resultado é calculado em tempo real. Toque nos botões +/- para ajustar cada variável.

#### Seção 3 — Conselhos por Faixa de Temperatura
Orientações dinâmicas com base na sensação calculada.

---

### 8. 🌧️ Tela: Precipitação & Chuva

**Como acessar:** Toque no widget **"Precipitação"** no bento grid.

#### Seção 1 — Hero Precipitação
- Volume acumulado em 24h (mm)
- Probabilidade atual (%)
- Classificação de intensidade

| Volume | Classificação |
|--------|--------------|
| 0 mm | Sem Chuva |
| < 2,5 mm | Chuva Leve / Garoa |
| 2,5–10 mm | Chuva Moderada |
| 10–50 mm | Chuva Forte |
| > 50 mm | Chuva Torrencial |

#### Seção 2 — Gráfico de Probabilidade Hora a Hora
- Barras para as próximas 12 horas
- Toque em qualquer hora para ver detalhes

#### Seção 3 — Calculadora de Captação de Água da Chuva
Para propriedades rurais e residências:
- Selecione a área do telhado (50, 100, 200, 500 m²)
- O app calcula o volume captável em litros (eficiência de 85%)

---

### 9. 💧 Tela: Umidade & Ponto de Orvalho

**Como acessar:** Toque no widget **"Umidade do Ar"** no bento grid.

#### Seção 1 — Hero Umidade
- Percentual de umidade relativa
- Zona de conforto colorida com conselho da OMS

| Umidade | Zona |
|---------|------|
| < 30% | Ar Muito Seco (Alerta) |
| 30–40% | Ar Seco (Atenção) |
| 40–60% | Faixa Ideal de Conforto |
| 60–80% | Umido |
| > 80% | Muito Umido / Saturado |

#### Seção 2 — Guia do Ponto de Orvalho
- Temperatura do ponto de orvalho atual
- 5 faixas de conforto interativas

#### Seção 3 — Estimativa de Secagem de Roupas
Calculadora baseada na umidade atual com tempo estimado.

---

### 10. 👁️ Tela: Visibilidade Atmosférica

**Como acessar:** Toque no widget **"Visibilidade"** no bento grid.

#### Seção 1 — Hero Visibilidade
- Distância de visibilidade em km ou milhas
- Status automático (de Nevoeiro Denso a Excepcional)

#### Seção 2 — Simulador de Marcos Visíveis
4 benchmarks interativos — o app indica se está visível ou oculto:
- Prédios Vizinhos (0,5 km)
- Pista de Aeroporto (3 km)
- Montanhas no Horizonte (10 km)
- Linha do Horizonte Pleno (25 km)

#### Seção 3 — Direção Segura em Rodovias
- Uso correto de faróis em diferentes condições
- Regra de distância de frenagem adaptada à visibilidade

---

### 11. 📊 Tela: Pressão Atmosférica

**Como acessar:** Toque no widget **"Pressão"** no bento grid.

#### Seção 1 — Hero Pressão
- Valor atual em hPa ou inHg
- Tendência barométrica (subindo / estável / caindo) com significado

#### Seção 2 — Simulador de Cenários de Pressão
4 cenários interativos:

| Pressão | Cenário |
|---------|---------|
| 990 hPa | Tempestade Severa |
| 1005 hPa | Chuvas / Instabilidade |
| 1013 hPa | Normal / Agradável |
| 1025 hPa | Ensolarado / Firme |

Cada cenário exibe tipo de tempo, movimento das massas de ar e efeitos na saúde.

---

### 12. ⏱️ Tela: Previsão Horária 24h (Interativa)

**Como acessar:** Toque no widget "Previsão Horária" ou no banner de alertas.

- Card Hero com a hora selecionada (temperatura, condição, chuva)
- Filtros de período: Todos / Manhã / Tarde / Noite
- Lista rolável de 24 horas com marcadores de nascer/pôr do sol
- Toque em qualquer hora para exibir detalhes no card Hero

---

### 13. 📅 Tela: Previsão de 10 Dias (Interativa)

**Como acessar:** Toque no widget "Previsão de 10 Dias".

- Card Hero com o dia selecionado (máx/mín, condição, chuva, UV)
- Lista de 10 dias com barra de temperatura visual
- Toque em qualquer dia para ver seus detalhes

---

### 14. 🌾 Calendário Lunar Agrícola

**Como acessar:** Botão verde (folha) no header **ou** widget "Fase da Lua & Plantio".

> Esta é a funcionalidade exclusiva do W3Labs Weather — um guia lunar completo para produtores rurais, horticultores e agricultores familiares, baseado em biologia vegetal e agricultura biodinâmica.

#### Aba 1 — Guia das Fases

**Status Astronômico em Tempo Real:**
- Fase lunar atual calculada astronomicamente
- Percentual de iluminação atual
- Status agrícola da fase

**Seletor das 4 Fases Lunares:**
Toque em cada fase para ver as recomendações:

| Fase | Características |
|------|----------------|
| Lua Nova | Seiva nas raízes; preparo do solo e adubação |
| Lua Crescente | Seiva sobe; ideal para parte aérea |
| Lua Cheia | Seiva máxima; colheita e germinação |
| Lua Minguante | Seiva desce; raízes e poda |

Para cada fase, o app exibe:
- Comportamento da Seiva
- Efeito Gravitacional e de Luminosidade
- Quando Plantar / Quando Evitar
- **O que Plantar por categoria** (Frutas, Folhosas, Legumes/Graos, Raizes/Tuberculos, Ervas/Aromaticas)
- **O que NAO Plantar** com explicação agronômica
- **Manejo & Práticas no Campo** (recomendadas e a evitar)
- **Sabedoria do Agricultor Familiar**

---

#### Aba 2 — O que Plantar?

Banco de dados com +30 culturas agrícolas:

- **Busca em tempo real** pelo nome da cultura
- **Filtros por categoria:** Fruta / Folhosa / Legume/Grão / Raiz/Tubérculo / Erva/Aromática
- Cada cultura exibe:
  - Melhor fase para plantar
  - Fase para evitar
  - Melhor fase para colher
  - Dica de campo prática

---

#### Aba 3 — Próximas Fases (45 dias)

Timeline das próximas transições lunares:
- Data exata da transição
- Dia da semana em português
- Contagem regressiva em dias
- Dica rápida de plantio

Planeje suas compras de sementes, preparo de canteiros e semeadura com até 45 dias de antecedência.

---

## 🌦️ Fundo Atmosférico Animado

O fundo muda dinamicamente com a condição climática atual:

| Condição | Animação |
|----------|----------|
| Dia limpo | Sol com rotação + raios pulsantes + gradiente azul claro |
| Noite limpa | Gradiente escuro profundo |
| Parcialmente Nublado | Nuvens deslizando em parallax (3 camadas) |
| Nublado | Nuvens densas + gradiente cinza |
| Chuva | 28 gotas animadas individualmente + nuvens |
| Tempestade | Raios com flash + chuva intensa |
| Neve | 22 flocos com queda e deriva horizontal |
| Nevoa | Gradiente difuso |
| Por do Sol | Gradiente laranja-roxo |

---

## 🔌 Fonte de Dados

| API | Dados |
|-----|-------|
| **Open-Meteo Forecast** | Temperatura, vento, UV, chuva, condição, nascer/pôr do sol, umidade, pressão, visibilidade |
| **Open-Meteo Air Quality** | AQI e PM2.5 em tempo real |
| **Open-Meteo Geocoding** | Busca de cidades pelo nome |
| **Expo Location** | GPS do dispositivo + reverse geocoding |

> Sem necessidade de chave de API. Todos os dados são obtidos gratuitamente.

A fase da lua é calculada **localmente** usando o ciclo sinódico de 29,53 dias.

---

## 🎨 Design System

| Elemento | Especificação |
|----------|---------------|
| Fonte | Nokia Pure Headline (Ultra Light, Light, Regular, Bold) |
| Tema | Dark mode exclusivo |
| Glassmorphism | BlurView (expo-blur) em todos os cards e modais |
| Gradientes | expo-linear-gradient para fundos atmosféricos |
| Paleta Base | #0A1118 (fundo) + Azuis, Verdes, Amarelos e Laranjas vibrantes |
| Animacoes | Animated nativo do React Native |
| Haptics | Feedback tátil em todos os elementos interativos (expo-haptics) |

---

## 📦 Dependências

```json
{
  "expo": "~57.0.29",
  "react-native": "0.86.3",
  "@expo/vector-icons": "^15.0.2",
  "expo-blur": "~57.0.3",
  "expo-font": "~57.0.4",
  "expo-haptics": "~57.0.3",
  "expo-linear-gradient": "~57.0.2",
  "expo-location": "~57.0.21",
  "expo-status-bar": "~57.0.1",
  "react-native-safe-area-context": "~5.7.0",
  "react-native-svg": "15.15.4",
  "react-native-web": "^0.21.2"
}
```

---

## 🛠️ Scripts Disponíveis

```bash
npx expo start           # Servidor de desenvolvimento (QR Code)
npx expo start --android # Abre diretamente no Android
npx expo start --ios     # Abre diretamente no iOS
npx expo start --web     # Versão web no navegador
npx expo lint            # Verificação de código (ESLint)
npx tsc --noEmit         # Verificação de tipos TypeScript
npx expo-doctor          # Diagnóstico de dependências e configuração
npx expo install --fix   # Corrige versões incompatíveis de pacotes
```

---

## 🤝 Compatibilidade

- **Android:** Expo Go no Google Play Store
- **iOS:** Expo Go na App Store
- **Web:** Qualquer navegador moderno (Chrome, Firefox, Safari, Edge)

---

<div align="center">

**W3Labs Weather © 2026 — Todos os direitos reservados**

Desenvolvido com Expo SDK 57 + React Native 0.86 + Open-Meteo API

</div>
#   W 3 L a b s - W e a t h e r  
 #   W 3 L a b s - W e a t h e r  
 