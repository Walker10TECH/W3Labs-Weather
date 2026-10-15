export type LunarPhaseKey = 'nova' | 'crescente' | 'cheia' | 'minguante';

export type CropCategory =
  | 'Fruta'
  | 'Folhosa'
  | 'Legume/Grão'
  | 'Raiz/Tubérculo'
  | 'Erva/Aromática';

export interface PlantCategoryDetail {
  categoryName: string;
  icon: string;
  items: string[];
  why: string;
}

export interface FarmPractice {
  title: string;
  desc: string;
  icon: string;
}

export interface LunarPhaseAgriInfo {
  id: LunarPhaseKey;
  name: string;
  tagline: string;
  accentColor: string;
  badgeBg: string;
  sapBehavior: string;
  gravityEffect: string;
  lightEffect: string;
  statusBadge: string;
  whenToPlant: string;
  whenNotToPlant: string;
  whatToPlant: PlantCategoryDetail[];
  whatNotToPlant: {
    items: string[];
    why: string;
  };
  recommendedPractices: FarmPractice[];
  practicesToAvoid: FarmPractice[];
  farmerWisdom: string;
  icon: string;
}

export interface CropInfo {
  id: string;
  name: string;
  category: CropCategory;
  bestPhase: LunarPhaseKey;
  bestPhaseName: string;
  avoidPhase: LunarPhaseKey;
  avoidPhaseName: string;
  bestHarvestPhase: string;
  tip: string;
  icon: string;
}

export interface UpcomingPhaseItem {
  date: string;
  formattedDate: string;
  dayOfWeek: string;
  phaseKey: LunarPhaseKey;
  phaseName: string;
  icon: string;
  isCurrent: boolean;
  daysRemaining: number;
}

export const LUNAR_PHASES_DATA: Record<LunarPhaseKey, LunarPhaseAgriInfo> = {
  nova: {
    id: 'nova',
    name: 'Lua Nova',
    tagline: 'Repouso Vegetativo, Enraizamento e Adubação',
    accentColor: '#60A5FA',
    badgeBg: 'rgba(96, 165, 250, 0.2)',
    statusBadge: 'Fase de Limpeza & Preparo',
    sapBehavior:
      'A seiva das plantas se concentra predominantemente nas raízes e no subsolo. A atividade vegetativa aérea diminui e a planta entra em repouso biológico.',
    gravityEffect:
      'Força de atração gravitacional combinada da Lua e do Sol direciona o fluxo hídrico para as camadas mais profundas do solo.',
    lightEffect:
      'Noites escuras sem reflexo lunar reduzem o estímulo da fotossíntese noturna, favorecendo descanso e fortalecimento do sistema radicular.',
    whenToPlant:
      'Ideal nos últimos 2 a 3 dias da fase, preparando o terreno para a explosão de brotação que ocorrerá na Lua Crescente.',
    whenNotToPlant:
      'Evite semear nos primeiros 2 dias (ápice da Lua Nova), especialmente espécies com folhas e frutos que dependem de impulso aéreo vigoroso.',
    whatToPlant: [
      {
        categoryName: 'Raízes e Tubérculos (Final da fase)',
        icon: 'carrot',
        items: ['Cenoura de ciclo rápido', 'Rabanete', 'Mandioca (mudas)', 'Batata-doce'],
        why: 'A energia concentrada na raiz favorece a fixação inicial e germinação subterrânea sadia.',
      },
      {
        categoryName: 'Sementes de Rápida Germinação',
        icon: 'seed',
        items: ['Milho verde', 'Feijão', 'Cebolinha', 'Alho-poró'],
        why: 'Sementes que rompem a casca em 4 a 6 dias nascerão sincronizadas com a força da Lua Crescente.',
      },
      {
        categoryName: 'Adubação Verde e Cobertura',
        icon: 'grass',
        items: ['Crotalária', 'Mucuna-preta', 'Aveia-preta', 'Girassol'],
        why: 'Fixação de nitrogênio e enriquecimento biológico da terra.',
      },
    ],
    whatNotToPlant: {
      items: ['Tomateiro', 'Pimentão', 'Alface americana', 'Couve-manteiga', 'Abobrinha'],
      why: 'Sementes de folhagens e frutos aéreos semeadas no pico da Lua Nova têm menor vigor germinativo e maior risco de estiolar ou sofrer com pragas.',
    },
    recommendedPractices: [
      {
        title: 'Adubação e Compostagem',
        desc: 'Incorpore esterco curtido, torta de mamona e compostos orgânicos. O solo absorve nutrientes profundamente.',
        icon: 'shovels',
      },
      {
        title: 'Poda de Limpeza e Galhos Secos',
        desc: 'Retire ramos ladrões, galhos doentes e folhas amareladas sem que a planta sangre seiva.',
        icon: 'content-cut',
      },
      {
        title: 'Eliminação de Pragas do Solo',
        desc: 'Excelente período para combater formigas cortadeiras, lagartas de solo e plantas invasoras.',
        icon: 'shield-bug',
      },
      {
        title: 'Corte de Madeiras e Bambus',
        desc: 'Mourões para cerca e bambus cortados nesta fase duram muito mais tempo e não pegam cupim ou caruncho.',
        icon: 'tree',
      },
    ],
    practicesToAvoid: [
      {
        title: 'Podas Drásticas de Frutíferas',
        desc: 'Evite desbastes severos que exijam brotação aérea imediata.',
        icon: 'close-circle-outline',
      },
      {
        title: 'Colheita para Venda Imediata',
        desc: 'Frutas colhidas na Nova possuem menos suco e concentração de sabor na polpa.',
        icon: 'basket-off-outline',
      },
    ],
    farmerWisdom:
      'O agricultor sábio usa a Lua Nova para descansar a terra, revigorar as raízes com adubo e limpar o pomar.',
    icon: 'moon-new',
  },

  crescente: {
    id: 'crescente',
    name: 'Lua Crescente',
    tagline: 'Força Máxima para Folhas, Caules, Enxertos e Frutos',
    accentColor: '#34D399',
    badgeBg: 'rgba(52, 211, 153, 0.2)',
    statusBadge: 'Fase de Semeadura Aérea',
    sapBehavior:
      'A seiva começa a subir ativamente das raízes em direção ao caule, ramos, gemas e folhas. O crescimento vegetativo acelera com vigor.',
    gravityEffect:
      'A atração gravitacional lunar intensifica a translocação de água e nutrientes para as partes aéreas superiores.',
    lightEffect:
      'Luminosidade lunar noturna crescente estimula a divisão celular foliar e o desenvolvimento acelerado das copas.',
    whenToPlant:
      'Excelente durante todos os dias da fase, em especial a partir do 3º dia após o início da Crescente até as vésperas da Cheia.',
    whenNotToPlant:
      'Nunca plante raízes e tubérculos nesta fase (como cenoura, mandioca e alho), pois eles focarão na folhagem e a raiz ficará fina e chocha.',
    whatToPlant: [
      {
        categoryName: 'Verduras e Folhosas',
        icon: 'leaf',
        items: ['Alface (todas)', 'Couve', 'Rúcula', 'Espinafre', 'Chicória', 'Agrião', 'Acelga'],
        why: 'A ascensão da seiva produz folhas tenras, largas, macias, saborosas e com alto teor de clorofila.',
      },
      {
        categoryName: 'Frutas e Hortaliças de Fruto',
        icon: 'fruit-cherries',
        items: ['Tomate', 'Pimentão', 'Quiabo', 'Berinjela', 'Morango', 'Melão', 'Melancia', 'Abóbora'],
        why: 'Excelente vigor inicial para a formação de ramos fortes que sustentarão floradas fartas.',
      },
      {
        categoryName: 'Leguminosas e Grãos',
        icon: 'grain',
        items: ['Feijão comum', 'Milho', 'Ervilha', 'Feijão-vagem', 'Fava', 'Soja'],
        why: 'Germinação veloz, perfilhamento vigoroso e fixação simbiótica de nitrogênio estimulada.',
      },
      {
        categoryName: 'Ervas e Condimentos',
        icon: 'flower-tulip',
        items: ['Cebolinha', 'Salsa', 'Coentro', 'Manjericão', 'Orégano'],
        why: 'Rápido rebrote e abundância de folhas para cortes frequentes.',
      },
    ],
    whatNotToPlant: {
      items: ['Cenoura', 'Beterraba', 'Mandioca', 'Batata-inglesa', 'Alho', 'Cebola'],
      why: 'Toda a energia da planta se desloca para a copa. A planta produzirá ramas enormes, mas as raízes e bulbos ficarão murchos, finos ou fibrosos.',
    },
    recommendedPractices: [
      {
        title: 'Enxertos e Borbulhas',
        desc: 'Melhor fase do mês para enxertia de árvores frutíferas. A casca se solta facilmente e a seiva abundante garante rápida cicatrização.',
        icon: 'tree-outline',
      },
      {
        title: 'Transplante de Mudas',
        desc: 'Mude as plantinhas da sementeira para os canteiros definitivos no final da tarde. O pegamento é quase 100%.',
        icon: 'sprout',
      },
      {
        title: 'Adubação Foliar e Irrigação',
        desc: 'As folhas absorvem biofertilizantes líquidos com máxima eficiência fotossintética.',
        icon: 'watering-can',
      },
    ],
    practicesToAvoid: [
      {
        title: 'Podas de Frutíferas',
        desc: 'Não pode ramos grossos: a planta sangrará muita seiva, enfraquecendo a árvore.',
        icon: 'close-circle-outline',
      },
      {
        title: 'Colher Raízes para Guardar',
        desc: 'Tubérculos colhidos agora desidratam com facilidade e apodrecem no depósito.',
        icon: 'basket-off-outline',
      },
    ],
    farmerWisdom:
      'Tudo o que dá e produz acima da terra ama ser plantado na Lua Crescente!',
    icon: 'moon-waxing-crescent',
  },

  cheia: {
    id: 'cheia',
    name: 'Lua Cheia',
    tagline: 'Pico Energético, Florescimento, Frutos Suculentos e Ervas',
    accentColor: '#FBBF24',
    badgeBg: 'rgba(251, 191, 36, 0.2)',
    statusBadge: 'Fase de Colheita Máxima',
    sapBehavior:
      'A seiva atinge sua maior concentração e pressão na extremidade da copa, flores, folhas superiores e polpa dos frutos.',
    gravityEffect:
      'Maré biológica atinge a amplitude máxima; umidade da superfície do solo é atraída para as partes vegetativas aéreas.',
    lightEffect:
      'Iluminação contínua durante a noite toda prolonga a atividade celular, tornando os frutos mais doces e aromáticos.',
    whenToPlant:
      'Melhor para semeadura de flores comestíveis, hortaliças de cabeça e plantas medicinais. Não é a melhor fase para transplantar mudas.',
    whenNotToPlant:
      'Não faça semeadura de raízes profundas nem podas; a planta fica hiperativa e muito sensível a lesões.',
    whatToPlant: [
      {
        categoryName: 'Hortaliças de Cabeça e Flores',
        icon: 'flower',
        items: ['Repolho', 'Couve-flor', 'Brócolis', 'Alcachofra'],
        why: 'Formam cabeças compactas, densas, pesadas e resistentes.',
      },
      {
        categoryName: 'Plantas Medicinais e Aromáticas',
        icon: 'spa',
        items: ['Camomila', 'Calêndula', 'Alecrim', 'Capim-santo', 'Hortelã'],
        why: 'Máxima concentração de óleos essenciais, princípios ativos e aroma.',
      },
      {
        categoryName: 'Milho Doce e Pipoca',
        icon: 'corn',
        items: ['Milho verde de feira', 'Milho pipoca'],
        why: 'Espigas bem granadas e com grãos cheios e açucarados.',
      },
    ],
    whatNotToPlant: {
      items: ['Mandioca', 'Inhame', 'Cenoura', 'Batatas', 'Alho'],
      why: 'Raízes não ganham volume sob a terra nesta fase; risco de rachaduras e fungos no subsolo.',
    },
    recommendedPractices: [
      {
        title: 'Colheita de Frutas de Mesa',
        desc: 'Colha laranjas, mangas, melancias, tomates e morangos. Estão mais doces, aromáticos e suculentos.',
        icon: 'fruit-watermelon',
      },
      {
        title: 'Colheita de Ervas Medicinais',
        desc: 'Colha as folhas e flores logo após o orvalho secar pela manhã para chás medicinais mais potentes.',
        icon: 'leaf-circle',
      },
      {
        title: 'Monitoramento Rigoroso de Pragas',
        desc: 'Lagartas, pulgões e fungos atacam com força na Cheia. Aplique caldas ecológicas (calda bordalesa ou extrato de fumo/nim).',
        icon: 'bug-check',
      },
    ],
    practicesToAvoid: [
      {
        title: 'Poda Severa e Desbastes',
        desc: 'Totalmente proibido podar na Cheia: risco alto de sangria de seiva, entrada de cancro e fungos.',
        icon: 'scissors-cutting',
      },
      {
        title: 'Capina Profunda ao Redor do Caule',
        desc: 'As raízes finas perto da superfície estão muito irrigadas e machucam com facilidade.',
        icon: 'close-circle-outline',
      },
    ],
    farmerWisdom:
      'Quer a fruta mais doce e a flor mais cheirosa na feira? Colha no frescor da manhã da Lua Cheia!',
    icon: 'moon-full',
  },

  minguante: {
    id: 'minguante',
    name: 'Lua Minguante',
    tagline: 'Seiva nas Raízes, Tubérculos, Podas e Colheita de Grãos',
    accentColor: '#A78BFA',
    badgeBg: 'rgba(167, 139, 250, 0.2)',
    statusBadge: 'Fase de Raízes & Podas',
    sapBehavior:
      'A seiva reflui da copa e desce em direção ao tronco inferior, raízes e bulbos. A planta ganha resistência estrutural e densidade radicular.',
    gravityEffect:
      'Diminuição da atração gravitacional estimula a penetração profunda das raízes em busca de água e micronutrientes.',
    lightEffect:
      'Menos claridade noturna desacelera a brotação da parte aérea, impedindo que folhosas espiguem prematuramente.',
    whenToPlant:
      'A fase perfeita para tudo o que se desenvolve e é colhido debaixo da terra.',
    whenNotToPlant:
      'Evite semear folhosas de corte (alface, rúcula, couve): elas demoram a crescer e têm menor rendimento de biomassa.',
    whatToPlant: [
      {
        categoryName: 'Raízes, Tubérculos e Bulbos',
        icon: 'seed-outline',
        items: [
          'Cenoura',
          'Beterraba',
          'Mandioca (aipim/macaxeira)',
          'Batata-inglesa',
          'Batata-doce',
          'Alho',
          'Cebola de cabeça',
          'Inhame',
          'Cará',
          'Gengibre',
          'Rabanete',
          'Nabo',
        ],
        why: 'A descida da seiva engrossa as raízes, acumula amido denso e evita que os tubérculos fiquem ocos ou fibrosos.',
      },
      {
        categoryName: 'Culturas Subterrâneas e Oleaginosas',
        icon: 'peanut',
        items: ['Amendoim', 'Cúrcuma (açafrão-da-terra)'],
        why: 'Excelente pegamento subterrâneo e rizomas mais resistentes a podridão.',
      },
    ],
    whatNotToPlant: {
      items: ['Alface lisa e crespa', 'Rúcula', 'Couve-manteiga', 'Tomate cereja', 'Morango'],
      why: 'As folhas crescem fracas, duras, espigam (florem antes da hora) e ficam amargas.',
    },
    recommendedPractices: [
      {
        title: 'Podas de Limpeza e Frutificação',
        desc: 'A melhor fase do ano para podar cafezais, videiras, citros e árvores frutíferas. Não há sangria e a cicatrização é rápida.',
        icon: 'content-cut',
      },
      {
        title: 'Colheita de Grãos e Armazenamento',
        desc: 'Colha feijão seco, milho, arroz e café. Os grãos têm menor umidade, duram muito no paiol e não sofrem com gorgulhos e carunchos.',
        icon: 'archive-arrow-down',
      },
      {
        title: 'Preparo do Solo e Calagem',
        desc: 'Aração, gradagem, calagem com calcário agrícola e incorporação de esterco para descansar a terra.',
        icon: 'tractor',
      },
      {
        title: 'Controle de Insetos e Formigas',
        desc: 'Controle de formigueiros e pulverizações contra fungos de solo.',
        icon: 'shield-check',
      },
    ],
    practicesToAvoid: [
      {
        title: 'Enxertia em Frutíferas',
        desc: 'A casca fica colada ao tronco pela falta de seiva nos ramos; enxertos não pegam.',
        icon: 'close-circle-outline',
      },
      {
        title: 'Transplante de Folhosas',
        desc: 'Folhas novinhas transplantadas na minguante travam e custam a rebrotar.',
        icon: 'close-circle-outline',
      },
    ],
    farmerWisdom:
      'Planta que dá debaixo da terra, madeira para mourão e poda de pomar: tudo pede Lua Minguante!',
    icon: 'moon-waning-crescent',
  },
};

export const AGRICULTURAL_CROPS: CropInfo[] = [
  {
    id: 'tomate',
    name: 'Tomate',
    category: 'Fruta',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Semear na Crescente produz mudas com caule forte para condução e cachos fartos. Colher na Cheia deixa o fruto mais doce e aromático.',
    icon: 'fruit-cherries',
  },
  {
    id: 'alface',
    name: 'Alface',
    category: 'Folhosa',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Crescente',
    tip: 'Plante 2 a 3 dias antes da Crescente. Na Minguante a alface espiga cedo e fica amarga. Rega diária nas horas frescas.',
    icon: 'leaf',
  },
  {
    id: 'cenoura',
    name: 'Cenoura',
    category: 'Raiz/Tubérculo',
    bestPhase: 'minguante',
    bestPhaseName: 'Lua Minguante',
    avoidPhase: 'crescente',
    avoidPhaseName: 'Lua Crescente',
    bestHarvestPhase: 'Lua Minguante',
    tip: 'Solo fofo sem pedras. Na Minguante a raiz cresce reta, lisa, doce e sem rachaduras. Se plantar na Crescente terá muita folha e raiz minúscula.',
    icon: 'carrot',
  },
  {
    id: 'mandioca',
    name: 'Mandioca / Aipim / Macaxeira',
    category: 'Raiz/Tubérculo',
    bestPhase: 'minguante',
    bestPhaseName: 'Lua Minguante',
    avoidPhase: 'cheia',
    avoidPhaseName: 'Lua Cheia',
    bestHarvestPhase: 'Lua Minguante',
    tip: 'Enterrar as manivas com as gemas para cima na Minguante garante raízes grossas, macias ao cozinhar e sem fibras duras.',
    icon: 'seed-outline',
  },
  {
    id: 'milho',
    name: 'Milho',
    category: 'Legume/Grão',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Minguante (seco) / Cheia (verde)',
    tip: 'Semeadura na Crescente assegura germinação uniforme em 5 dias. Para milho verde de pamonha, colha na Cheia; para grão seco no paiol, colha na Minguante.',
    icon: 'corn',
  },
  {
    id: 'feijao',
    name: 'Feijão',
    category: 'Legume/Grão',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'cheia',
    avoidPhaseName: 'Lua Cheia',
    bestHarvestPhase: 'Lua Minguante (armazenamento)',
    tip: 'Semear no 2º dia da Crescente com terra úmida. Colheita na Minguante impede que o gorgulho (caruncho) destrua os grãos guardados.',
    icon: 'grain',
  },
  {
    id: 'batata_inglesa',
    name: 'Batata-Inglesa',
    category: 'Raiz/Tubérculo',
    bestPhase: 'minguante',
    bestPhaseName: 'Lua Minguante',
    avoidPhase: 'crescente',
    avoidPhaseName: 'Lua Crescente',
    bestHarvestPhase: 'Lua Minguante',
    tip: 'Amontoa na Minguante protege as batatas da luz e estimula novos tubérculos grandes e lisos.',
    icon: 'seed',
  },
  {
    id: 'batata_doce',
    name: 'Batata-Doce',
    category: 'Raiz/Tubérculo',
    bestPhase: 'minguante',
    bestPhaseName: 'Lua Minguante',
    avoidPhase: 'crescente',
    avoidPhaseName: 'Lua Crescente',
    bestHarvestPhase: 'Lua Minguante',
    tip: 'Plante ramas na Minguante em camalhões fofos. Se plantar na Crescente, a rama cresce metros e não produz batata no chão.',
    icon: 'seed-outline',
  },
  {
    id: 'beterraba',
    name: 'Beterraba',
    category: 'Raiz/Tubérculo',
    bestPhase: 'minguante',
    bestPhaseName: 'Lua Minguante',
    avoidPhase: 'crescente',
    avoidPhaseName: 'Lua Crescente',
    bestHarvestPhase: 'Lua Minguante',
    tip: 'Desbaste os brotos extras no início da Minguante para que o bulbo central engrosse redondo e vermelho intenso.',
    icon: 'carrot',
  },
  {
    id: 'couve',
    name: 'Couve-Manteiga',
    category: 'Folhosa',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Crescente',
    tip: 'Plantar mudas de broto lateral na Crescente. Colha as folhas inferiores semanalmente para estimular nova copa vigorosa.',
    icon: 'leaf',
  },
  {
    id: 'pimentao',
    name: 'Pimentão',
    category: 'Fruta',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Exige solo rico em matéria orgânica. Transplante na Crescente para floração farta e frutos carnudos de casca brilhante.',
    icon: 'fruit-cherries',
  },
  {
    id: 'alho',
    name: 'Alho',
    category: 'Raiz/Tubérculo',
    bestPhase: 'minguante',
    bestPhaseName: 'Lua Minguante',
    avoidPhase: 'crescente',
    avoidPhaseName: 'Lua Crescente',
    bestHarvestPhase: 'Lua Minguante',
    tip: 'Plantar os dentes graúdos com o bico para cima na Minguante. A cabeça fica graúda e com boa conservação em réstia.',
    icon: 'seed',
  },
  {
    id: 'cebola',
    name: 'Cebola de Cabeça',
    category: 'Raiz/Tubérculo',
    bestPhase: 'minguante',
    bestPhaseName: 'Lua Minguante',
    avoidPhase: 'crescente',
    avoidPhaseName: 'Lua Crescente',
    bestHarvestPhase: 'Lua Minguante',
    tip: 'Mudas transplantadas na Minguante formam bulbos densos que não apodrecem com fungos de casca.',
    icon: 'seed-outline',
  },
  {
    id: 'abobrinha',
    name: 'Abobrinha',
    category: 'Fruta',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Semear direto na cova com esterco curtido. Floresce rapidamente e produz frutos tenros se plantada na Crescente.',
    icon: 'fruit-watermelon',
  },
  {
    id: 'melancia',
    name: 'Melancia',
    category: 'Fruta',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Semear na Crescente; colher na Cheia quando a gavinha secar. Na Cheia atinge o máximo de brix (doçura) e suco.',
    icon: 'fruit-watermelon',
  },
  {
    id: 'rucula',
    name: 'Rúcula',
    category: 'Folhosa',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Crescente',
    tip: 'Ciclo ultra-rápido (25-30 dias). Semeie na Crescente para folhas largas e picância equilibrada sem espigar.',
    icon: 'leaf',
  },
  {
    id: 'morango',
    name: 'Morango',
    category: 'Fruta',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Transplante os estolões (mudas) na Crescente em canteiros elevados com mulching (plástico preto ou palha).',
    icon: 'fruit-cherries',
  },
  {
    id: 'quiabo',
    name: 'Quiabo',
    category: 'Legume/Grão',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Crescente',
    tip: 'Adora calor e sol pleno. Semear na Crescente garante frutos macios sem fiapos lenhosos.',
    icon: 'sprout',
  },
  {
    id: 'brocolis',
    name: 'Brócolis',
    category: 'Folhosa',
    bestPhase: 'cheia',
    bestPhaseName: 'Lua Cheia',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'A inflorescência forma botões densos e pesados quando cultivada sob estímulo da Lua Cheia.',
    icon: 'flower',
  },
  {
    id: 'couve_flor',
    name: 'Couve-Flor',
    category: 'Folhosa',
    bestPhase: 'cheia',
    bestPhaseName: 'Lua Cheia',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Proteja a cabeça branca amarrando as folhas de cima. Cabeça compacta e pesada na Cheia.',
    icon: 'flower',
  },
  {
    id: 'pepino',
    name: 'Pepino',
    category: 'Fruta',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Cultivar tutorado em cerca ou espaldeira. Produz frutos crocantes e sem amargor na Crescente.',
    icon: 'fruit-cherries',
  },
  {
    id: 'berinjela',
    name: 'Berinjela',
    category: 'Fruta',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Planta arbustiva vigorosa. Na Crescente ramifica bem e segura as flores sem abortar frutos.',
    icon: 'fruit-cherries',
  },
  {
    id: 'maracuja',
    name: 'Maracujá',
    category: 'Fruta',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Trepadeira vigorosa. Podas de condução na Minguante, mas plantio e enxerto na Crescente.',
    icon: 'fruit-watermelon',
  },
  {
    id: 'gengibre',
    name: 'Gengibre',
    category: 'Raiz/Tubérculo',
    bestPhase: 'minguante',
    bestPhaseName: 'Lua Minguante',
    avoidPhase: 'crescente',
    avoidPhaseName: 'Lua Crescente',
    bestHarvestPhase: 'Lua Minguante',
    tip: 'Plante pedaços de rizoma com gemas viáveis na Minguante. Rizomas carnudos e ricos em óleo aromático.',
    icon: 'seed-outline',
  },
  {
    id: 'abobora',
    name: 'Abóbora / Jerimum',
    category: 'Fruta',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Ramas rasteiras que fecham o canteiro. Polpa alaranjada e doce se colhida na Cheia.',
    icon: 'fruit-watermelon',
  },
  {
    id: 'cebolinha_salsa',
    name: 'Cheiro-Verde (Cebolinha e Salsa)',
    category: 'Erva/Aromática',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Crescente',
    tip: 'Corte rente a 2 cm do solo na Crescente para rebrota rápida, contínua e abundante.',
    icon: 'flower-tulip',
  },
  {
    id: 'alecrim_hortela',
    name: 'Ervas Medicinais (Hortelã, Alecrim, Manjericão)',
    category: 'Erva/Aromática',
    bestPhase: 'cheia',
    bestPhaseName: 'Lua Cheia',
    avoidPhase: 'nova',
    avoidPhaseName: 'Lua Nova',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Colheita às 9h da manhã na Lua Cheia maximiza a concentração de óleos essenciais medicinais.',
    icon: 'spa',
  },
  {
    id: 'cafe',
    name: 'Café',
    category: 'Fruta',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente (plantio)',
    avoidPhase: 'cheia',
    avoidPhaseName: 'Lua Cheia (poda)',
    bestHarvestPhase: 'Lua Minguante (colheita do grão)',
    tip: 'Plantar mudas no campo na Crescente. Poda esqueletamento ou decote na Minguante. Colheita na Minguante melhora bebida e seca de terreiro.',
    icon: 'coffee',
  },
  {
    id: 'banana',
    name: 'Banana',
    category: 'Fruta',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente',
    avoidPhase: 'minguante',
    avoidPhaseName: 'Lua Minguante',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Desbaste de filhos ladrões na Nova. Plantar rizomas novos na Crescente. Colher o cacho verde na Cheia acelera maturação uniforme.',
    icon: 'fruit-cherries',
  },
  {
    id: 'citros',
    name: 'Laranja e Limão (Citros)',
    category: 'Fruta',
    bestPhase: 'crescente',
    bestPhaseName: 'Lua Crescente (plantio/enxerto)',
    avoidPhase: 'cheia',
    avoidPhaseName: 'Lua Cheia (poda)',
    bestHarvestPhase: 'Lua Cheia',
    tip: 'Enxertia na Crescente; poda de aeração na Minguante; colheita de frutas para suco na Lua Cheia para máxima acidez e doçura.',
    icon: 'fruit-citrus',
  },
];

/**
 * Maps a standard moon phase name string or date to agricultural key.
 */
export function getAgriculturalPhaseKey(phaseNameOrNormalized: string | number): LunarPhaseKey {
  if (typeof phaseNameOrNormalized === 'number') {
    const val = phaseNameOrNormalized;
    // 0 = New Moon, 0.25 = First Quarter, 0.5 = Full Moon, 0.75 = Last Quarter
    if (val >= 0.875 || val < 0.125) return 'nova';
    if (val >= 0.125 && val < 0.375) return 'crescente';
    if (val >= 0.375 && val < 0.625) return 'cheia';
    return 'minguante';
  }

  const normalized = phaseNameOrNormalized.toLowerCase();
  if (normalized.includes('nova')) return 'nova';
  if (normalized.includes('cheia')) return 'cheia';
  if (normalized.includes('minguante')) return 'minguante';
  return 'crescente';
}

/**
 * Calculates current lunar status and upcoming phase schedule for the next 45 days.
 */
export function calculateLunarSchedule(currentDate: Date = new Date()): {
  currentPhaseKey: LunarPhaseKey;
  currentInfo: LunarPhaseAgriInfo;
  upcomingList: UpcomingPhaseItem[];
} {
  const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
  const cycleDays = 29.53058770576;
  const cycleMs = cycleDays * 24 * 60 * 60 * 1000;
  const nowMs = currentDate.getTime();

  const diff = (nowMs - knownNewMoon) % cycleMs;
  const normalizedNow = (diff < 0 ? diff + cycleMs : diff) / cycleMs;
  const currentPhaseKey = getAgriculturalPhaseKey(normalizedNow);
  const currentInfo = LUNAR_PHASES_DATA[currentPhaseKey];

  const upcomingList: UpcomingPhaseItem[] = [];

  // Check the next 45 days day by day to find exact transition points
  let lastRecordedPhase: LunarPhaseKey = currentPhaseKey;

  for (let d = 1; d <= 45; d++) {
    const checkDate = new Date(nowMs + d * 24 * 60 * 60 * 1000);
    const checkDiff = (checkDate.getTime() - knownNewMoon) % cycleMs;
    const checkNorm = (checkDiff < 0 ? checkDiff + cycleMs : checkDiff) / cycleMs;
    const dayPhaseKey = getAgriculturalPhaseKey(checkNorm);

    if (dayPhaseKey !== lastRecordedPhase) {
      lastRecordedPhase = dayPhaseKey;
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const monthNames = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
      ];

      const dayStr = String(checkDate.getDate()).padStart(2, '0');
      const monthStr = monthNames[checkDate.getMonth()];
      const dayOfWeek = dayNames[checkDate.getDay()];

      upcomingList.push({
        date: checkDate.toISOString().split('T')[0],
        formattedDate: `${dayStr} de ${monthStr}`,
        dayOfWeek,
        phaseKey: dayPhaseKey,
        phaseName: LUNAR_PHASES_DATA[dayPhaseKey].name,
        icon: LUNAR_PHASES_DATA[dayPhaseKey].icon,
        isCurrent: false,
        daysRemaining: d,
      });

      if (upcomingList.length >= 8) break;
    }
  }

  return {
    currentPhaseKey,
    currentInfo,
    upcomingList,
  };
}
