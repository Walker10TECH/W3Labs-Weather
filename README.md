# 🌤️ W3Labs Weather

> **Aplicativo de previsão do tempo premium para Android, iOS e Web — com telas dedicadas interativas e Calendário Lunar Agrícola para Produtores Rurais e Agricultura Familiar.**

---

## 📱 Visão Geral

O **W3Labs Weather** é um aplicativo móvel desenvolvido com **Expo / React Native** que vai muito além de um simples app de clima. Cada informação meteorológica possui uma **tela dedicada e interativa** com simuladores, gráficos, calculadoras e guias práticos. O app consome dados reais da **API Open-Meteo** (gratuita, sem chave) e inclui um exclusivo **Calendário Lunar Agrícola** voltado para produtores rurais e agricultura familiar.

---

## 🚀 Como Executar

### Pré-requisitos

* **Node.js:** >= 18
* **Expo CLI:** Expo SDK 57
* **Android Studio / Expo Go:** Qualquer versão recente
* **iOS Simulator / Expo Go:** Xcode 15+

### Instalação e Execução

```bash
# Clone o projeto e instale as dependências
git clone <repo-url>
cd W3Labs-Weather
npx expo install

# Inicie o servidor de desenvolvimento
npx expo start

# Atalhos de execução
npx expo start --android # Inicia no Android
npx expo start --ios     # Inicia no iOS
npx expo start --web     # Inicia na Web

```

---

## 🗂️ Estrutura do Projeto

```text
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
    └── fonts/                     # Nokia Pure Headline

```

---

## 🖥️ Funcionalidades e Telas Principais

### 1. 🏠 Tela Principal (Home)

* **Barra de Controles:** Busca de cidades, GPS, Calendário Lunar, °C/°F, Atualizar.
* **Painel Hero:** Temperatura atual, máxima/mínima, sensação térmica e alertas.
* **Previsões:** Previsão horária (24h) e de 10 dias.
* **Bento Grid:** Cards interativos para cada métrica climática.

### 2. 🔍 Busca de Cidades

Integração com API Open-Meteo Geocoding (busca automática ao digitar), suporte a GPS nativo e lista de cidades salvas.

### 3. ☀️ Índice UV & Proteção Solar

Calculadora de tempo seguro ao sol baseada no tipo de pele (Fitzpatrick) e FPS do protetor solar, além de checklist de proteção.

### 4. 🌬️ Vento & Rajadas

Bússola animada, Rosa dos Ventos interativa, simulador da Escala Beaufort e indicações de segurança para atividades ao ar livre (drones, ciclismo).

### 5. 🌾 Calendário Lunar Agrícola (Exclusivo)

* **Fases da Lua:** Status astronômico em tempo real e percentual de iluminação.
* **Guia de Plantio:** O que plantar (frutas, folhosas, raízes) e o que evitar baseado na fase lunar.
* **Banco de Culturas:** Busca por mais de 30 culturas com recomendações de colheita e plantio.
* **Previsão Lunar:** Timeline para os próximos 45 dias.

### 6. Outros Simuladores e Informações

* **Ciclo Solar:** Horas douradas, zênite e calendário sazonal.
* **Qualidade do Ar (AQI):** Recomendações de saúde e poluentes.
* **Sensação Térmica:** Calculadora interativa ajustando vento e umidade.
* **Precipitação:** Calculadora de captação de água de chuva para telhados.
* **Umidade & Visibilidade:** Ponto de orvalho, estimativa para secar roupas e marcos visíveis.

---

## 🌦️ Fundo Atmosférico Animado

O app renderiza animações dinâmicas de acordo com o clima:

* **Dia limpo:** Sol rotativo e raios pulsantes.
* **Chuva e Tempestade:** Gotas animadas individualmente e flashes de raios.
* **Neve e Nublado:** Flocos em queda e nuvens em parallax (3 camadas).

---

## 🔌 APIs e Dependências Principais

Todos os dados meteorológicos são obtidos gratuitamente, sem necessidade de chave de API.

* **APIs:** Open-Meteo Forecast, Air Quality e Geocoding.
* **Dependências Chave:**
* `expo` (~57.0.29)
* `react-native` (0.86.3)
* `expo-blur` (Glassmorphism)
* `expo-linear-gradient` (Fundos)
* `expo-location` (GPS)
* `expo-haptics` (Feedback tátil)



---

**W3Labs Weather © 2026 — Desenvolvido com Expo SDK 57 + React Native 0.86 + Open-Meteo API**
