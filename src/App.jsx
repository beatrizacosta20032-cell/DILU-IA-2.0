import React, { useState, useEffect } from 'react';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const GAME_CONSTANTS = {
  ANSWER_TOLERANCE: 0.1,
  DEFAULT_STABILITY_LOSS: 20,
  STABILITY_BONUS: 10,
  MAX_STABILITY: 100,
  MIN_STABILITY: 0,
  TRANSITION_DELAY: 2500,
  GAMEOVER_DELAY: 1500,
  CODE_TRANSITION_DELAY: 2000,
};

const STABILITY_LOSS_BY_DIFFICULTY = {
  easy: 15,
  medium: 20,
  hard: 25,
};

const CHATBOT_URLS = {
  '1-1': 'https://m365.cloud.microsoft/chat/?titleId=T_3bf5498b-f31d-4032-51fd-3d003e07c5b1&source=embedded-builder',
  '1-2': 'https://m365.cloud.microsoft/chat/?titleId=T_12d6c892-299c-f550-fef9-bed803ee1f72&source=embedded-builder',
  '1-3': 'https://m365.cloud.microsoft/chat/?titleId=T_804cf537-2a49-457b-5a39-98763349d9a0&source=embedded-builder',
  '2-1': 'https://m365.cloud.microsoft/chat/?titleId=T_3648ba27-3883-9ef8-861c-a374a9b6aa04&source=embedded-builder',
  '2-2': 'https://m365.cloud.microsoft/chat/?titleId=T_b51078b0-6854-5723-f37d-0397e5e8dcf7&source=embedded-builder',
  '2-3': 'https://m365.cloud.microsoft/chat/?titleId=T_03d42b68-9b6e-128c-810b-8aeb07f19431&source=embedded-builder',
  '3-1': 'https://m365.cloud.microsoft/chat/?titleId=T_230dd5e6-5281-c02e-f957-d187b6e12a50&source=embedded-builder',
  '3-2': 'https://m365.cloud.microsoft/chat/?titleId=T_3bb29a0e-38e2-40d9-fda0-407bdca2afd9&source=embedded-builder',
  '3-3': 'https://m365.cloud.microsoft/chat/?titleId=T_1da5d9b0-723e-a5fb-e559-c0640c409eff&source=embedded-builder',
};
const CODE_CHATBOT_URL = 'https://m365.cloud.microsoft/chat/?titleId=T_7bd90963-4815-f52b-2966-dc00304d7312&source=embedded-builder';

// ============================================================================
// GAME DATA
// ============================================================================

const levels = [
  {
    id: 1,
    name: 'Nivel 1',
    rank: 'Estagiário 🧹',
    levelcode: 'lab2026',
    exercises: [
      {
        id: 1,
        title: 'Emergência na Urgência',
        difficulty: 'easy',
        story:
          'Chega um paciente desidratado e é iniciada perfusão com solução a 5%. O saco contém 500 mL. Quanta glucose entra na corrente sanguínea?',
        formula: 'C = m / V',
        formulaVisible: true,
        inputs: [
          { id: 'vol', label: 'Volume (ml)', value: 500 },
          { id: 'conc', label: 'Concentração (%)', value: 5 },
        ],
        targetLabel: 'Massa de Soluto (g)',
        correct: 25,
        xp: 100,
      },
      {
        id: 2,
        title: 'Primeira Preparação',
        difficulty: 'easy',
        story:
          'No teu primeiro turno sozinho, pedem-te 500 mL de NaOH 0,3 M. O frasco só indica a massa molar (40 g/mol). Que massa de NaOH precisas?',
        formula: 'm = n × Mw',
        formulaVisible: true,
        inputs: [
          { id: 'c', label: 'Concentração molar (M)', value: 0.3 },
          { id: 'v', label: 'Volume (ml)', value: 500 },
          { id: 'mw', label: 'Massa Molar (g/mol)', value: 40 },
        ],
        targetLabel: 'Massa de Soluto (g)',
        correct: 6,
        xp: 100,
      },
      {
        id: 3,
        title: 'O Primeiro Frasco de BSA',
        difficulty: 'medium',
        story:
          'Estás a preparar 5,0 mL de uma solução de stock de Bovine Serum Albumin (BSA) com uma concentração de 0,30 mM. Sabes que a massa molar da BSA é 66,5 kDa. Qual a massa necessária de BSA?',
        formula: '???',
        formulaVisible: false,
        inputs: [
          { id: 'conc', label: 'Concentração (mM)', value: 0.30 },
          { id: 'vol', label: 'Volume (ml)', value: 5 },
        ],
        targetLabel: 'Massa de Soluto (mg), arredondada às unidades',
        correct: 100,
        xp: 100,
      },
    ],
  },
  {
    id: 2,
    name: 'Nivel 2',
    rank: 'Técnico de Lab 🥼',
    levelcode: 'h7neutral',
    exercises: [
      {
        id: 1,
        title: 'Ajuste Crítico',
        difficulty: 'medium',
        story:
          'Temos 10 mL de solução 2M e queremos obter uma solução final de 0.4M. Qual o volume final?',
        formula: 'C1 x V1 = C2 x V2',
        formulaVisible: true,
        inputs: [
          { id: 'c1', label: 'C. Inicial (M)', value: 2 },
          { id: 'v1', label: 'V. Inicial (ml)', value: 10 },
          { id: 'c2', label: 'C. Final (M)', value: 0.4 },
        ],
        targetLabel: 'Volume Final (ml)',
        correct: 50,
        xp: 150,
      },
      {
        id: 2,
        title: 'A Solução Padrão S1',
        difficulty: 'medium',
        story:
          'Estás a preparar 2,0 mL de uma solução com concentração 0,030 mM a partir de uma solução stock de BSA 0,30 mM. Que volume de solução stock necessitas?',
        formula: 'C1 x V1 = C2 x V2',
        formulaVisible: true,
        inputs: [
          { id: 'c1', label: 'C. Inicial (mM)', value: 0.30 },
          { id: 'c2', label: 'C. Final (mM)', value: 0.030 },
          { id: 'v2', label: 'V. Final (ml)', value: 2 },
        ],
        targetLabel: 'V. Inicial (µL)',
        correct: 200,
        xp: 150,
      },
      {
        id: 3,
        title: 'A Memória do Químico',
        difficulty: 'hard',
        story:
          'O manual ardeu! Precisas de preparar uma diluição com fator 5 a partir de 20 mL de solução. Qual o volume final?',
        formula: '???',
        formulaVisible: false,
        inputs: [
          { id: 'vi', label: 'Volume Inicial (ml)', value: 20 },
          { id: 'f', label: 'Fator de Diluição', value: 5 },
        ],
        targetLabel: 'Volume Final (ml)',
        correct: 100,
        xp: 200,
      },
    ],
  },
  {
    id: 3,
    name: 'Nivel 3',
    rank: 'Cientista Chefe 🧪',
    levelcode: 'avogadro602',
    exercises: [
      {
        id: 1,
        title: 'O Caminho até S3',
        difficulty: 'medium',
        story:
          'Uma amostra sofre três diluições sucessivas: 1:10, 1:2 e 1:2. Qual foi o fator total aplicado?',
        formula: 'Fator total = f1 x f2 x f3',
        formulaVisible: true,
        inputs: [
          { id: 'f1', label: 'Fator 1', value: 10 },
          { id: 'f2', label: 'Fator 2', value: 2 },
          { id: 'f3', label: 'Fator 3', value: 2 },
        ],
        targetLabel: 'Fator de Diluição Total',
        correct: 40,
        xp: 200,
      },
      {
        id: 2,
        title: 'A Série de Padrões',
        difficulty: 'hard',
        story:
          'Estás a preparar a série de diluições seriadas 1:2 (S2 a S5) para a curva de calibração de BSA. Cada tubo intermédio recebe 1000 µL de água destilada e depois 1000 µL do tubo anterior. Desse volume, 1000 µL segue para o tubo seguinte e 1000 µL fica disponível para o ensaio de Bradford. Que volume total (mínimo) precisa de estar presente em cada tubo intermédio?',
        formula: 'V_necessário = V_ensaio + V_próximo_tubo',
        formulaVisible: true,
        inputs: [
          { id: 'vEnsaio', label: 'Volume para ensaio (µL)', value: 1000 },
          { id: 'vProximo', label: 'Volume para próximo tubo (µL)', value: 1000 },
        ],
        targetLabel: 'Volume mínimo necessário (µL)',
        correct: 2000,
        xp: 250,
      },
      {
        id: 3,
        title: 'A Amostra Sanguínea',
        difficulty: 'hard',
        story:
          'Após duas diluições sucessivas de fator 10 (1:10 e depois 1:10), contas 100 células em 10 µL da diluição final. Qual era a concentração inicial, em milhões de células/mL?',
        formula: '???',
        formulaVisible: false,
        inputs: [
          { id: 'f1', label: 'Fator 1', value: 10 },
          { id: 'f2', label: 'Fator 2', value: 10 },
          { id: 'cells', label: 'Células contadas', value: 100 },
          { id: 'vol', label: 'Volume contado (µL)', value: 10 },
        ],
        targetLabel: 'Concentração Inicial (milhões de células/mL)',
        correct: 1,
        xp: 300,
      },
    ],
  },
];

// ============================================================================
// BEAKER VISUALIZATION DATA
// ============================================================================

const BEAKER_CONFIGS = {
  // ---- Nível 1 ----
  '1-1': [
    {
      label: 'Soro Glicosado 5%',
      icon: '💉',
      volume: 500,
      concentration: 5,
      showConc: false,
      color: 'linear-gradient(180deg, #FDE68A 0%, #F59E0B 100%)',
      soluteDots: 6,
      dotColor: 'rgba(255,255,255,0.9)',
      annotation: '500 mL',
    },
  ],
  '1-2': [
    {
      label: 'NaOH sólido',
      icon: '🧂',
      volume: 55,
      concentration: 100,
      showConc: false,
      color: 'linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%)',
      soluteDots: 3,
      dotColor: 'rgba(107,114,128,0.9)',
      annotation: '? gramas',
    },
    {
      label: 'Água destilada',
      icon: '💧',
      volume: 500,
      concentration: 0,
      showConc: false,
      color: 'linear-gradient(180deg, #DBEAFE 0%, #BFDBFE 100%)',
      soluteDots: 0,
      annotation: '~500 mL',
      arrowLabel: '+ dissolver',
    },
    {
      label: 'NaOH 0,3 M',
      icon: '⚗️',
      volume: 500,
      concentration: 3,
      showConc: false,
      color: 'linear-gradient(180deg, #A5F3FC 0%, #67E8F9 100%)',
      soluteDots: 5,
      dotColor: 'rgba(255,255,255,0.9)',
      annotation: '500 mL final',
      arrowLabel: '= solução',
    },
  ],
  '1-3': [
    {
      label: 'Stock BSA 0,30 mM',
      icon: '⚪',
      volume: 500,
      concentration: 0.3,
      showConc: false,
      color: 'linear-gradient(180deg, #FBCFE8 0%, #F472B6 100%)',
      soluteDots: 3,
      dotColor: 'rgba(255,255,255,0.95)',
      annotation: '5,0 mL',
    },
  ],
 
  // ---- Nível 2 ----
  '2-1': [
    {
      label: '2 M (inicial)',
      icon: '🔵',
      volume: 100,
      concentration: 20,
      showConc: false,
      color: 'linear-gradient(180deg, #3B82F6 0%, #1E40AF 100%)',
      soluteDots: 9,
      dotColor: 'rgba(255,255,255,0.95)',
      annotation: '10 mL',
    },
    {
      label: '0,4 M (final)',
      icon: '🔷',
      volume: 500,
      concentration: 4,
      showConc: false,
      color: 'linear-gradient(180deg, #93C5FD 0%, #60A5FA 100%)',
      soluteDots: 3,
      dotColor: 'rgba(255,255,255,0.9)',
      annotation: '? mL total',
      arrowLabel: 'diluir',
    },
  ],
  '2-2': [
    {
      label: 'Stock BSA 0,30 mM',
      icon: '⚪',
      volume: 100,
      concentration: 30,
      showConc: false,
      color: 'linear-gradient(180deg, #F472B6 0%, #DB2777 100%)',
      soluteDots: 9,
      dotColor: 'rgba(255,255,255,0.95)',
      annotation: '? µL necessários',
    },
    {
      label: 'Água destilada',
      icon: '💧',
      volume: 400,
      concentration: 0,
      showConc: false,
      color: 'linear-gradient(180deg, #DBEAFE 0%, #BFDBFE 100%)',
      soluteDots: 0,
      annotation: 'completar até 2,0 mL',
      arrowLabel: '+ água',
    },
    {
      label: 'S1 — 0,030 mM',
      icon: '🧪',
      volume: 500,
      concentration: 3,
      showConc: false,
      color: 'linear-gradient(180deg, #FBCFE8 0%, #F9A8D4 100%)',
      soluteDots: 1,
      dotColor: 'rgba(219,39,119,0.85)',
      annotation: '2,0 mL final',
      arrowLabel: '= S1',
    },
  ],
  '2-3': [
    {
      label: 'Inicial',
      icon: '🟣',
      volume: 100,
      concentration: 50,
      showConc: false,
      color: 'linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%)',
      soluteDots: 8,
      dotColor: 'rgba(255,255,255,0.95)',
      annotation: '20 mL',
    },
    {
      label: 'Final',
      icon: '🔮',
      volume: 500,
      concentration: 10,
      showConc: false,
      color: 'linear-gradient(180deg, #C4B5FD 0%, #A78BFA 100%)',
      soluteDots: 2,
      dotColor: 'rgba(255,255,255,0.9)',
      annotation: '? mL — fator 5',
      arrowLabel: '÷5',
    },
  ],
 
  // ---- Nível 3 ----
  '3-1': [
    {
      label: 'Amostra',
      icon: '🩸',
      volume: 500,
      concentration: 90,
      showConc: false,
      color: 'linear-gradient(180deg, #DC2626 0%, #991B1B 100%)',
      soluteDots: 10,
      dotColor: 'rgba(255,255,255,0.95)',
      annotation: 'inicial',
    },
    {
      volume: 500,
      concentration: 9,
      showConc: false,
      color: 'linear-gradient(180deg, #F87171 0%, #EF4444 100%)',
      soluteDots: 4,
      dotColor: 'rgba(255,255,255,0.9)',
      annotation: '1:10',
      arrowLabel: '1:10',
    },
    {
      volume: 500,
      concentration: 4.5,
      showConc: false,
      color: 'linear-gradient(180deg, #FCA5A5 0%, #F87171 100%)',
      soluteDots: 2,
      dotColor: 'rgba(255,255,255,0.9)',
      annotation: '1:2',
      arrowLabel: '1:2',
    },
    {
      label: 'Final',
      volume: 500,
      concentration: 2.25,
      showConc: false,
      color: 'linear-gradient(180deg, #FEE2E2 0%, #FECACA 100%)',
      soluteDots: 1,
      dotColor: 'rgba(220,38,38,0.85)',
      annotation: '1:2 — fator total?',
      arrowLabel: '1:2',
    },
  ],
  '3-2': [
    {
      label: 'Tubo Intermédio',
      icon: '🧪',
      volume: 350,
      concentration: 20,
      showConc: false,
      color: 'linear-gradient(180deg, #C084FC 0%, #A855F7 100%)',
      soluteDots: 5,
      dotColor: 'rgba(255,255,255,0.9)',
      annotation: '? µL mínimo',
    },
    {
      label: 'Bradford',
      icon: '🔬',
      volume: 200,
      concentration: 20,
      showConc: false,
      color: 'linear-gradient(180deg, #FCD34D 0%, #FBBF24 100%)',
      soluteDots: 3,
      dotColor: 'rgba(255,255,255,0.9)',
      annotation: '1000 µL',
      arrowLabel: 'ensaio',
    },
    {
      label: 'Próximo Tubo',
      icon: '➡️',
      volume: 200,
      concentration: 20,
      showConc: false,
      color: 'linear-gradient(180deg, #93C5FD 0%, #60A5FA 100%)',
      soluteDots: 3,
      dotColor: 'rgba(255,255,255,0.9)',
      annotation: '1000 µL',
      arrowLabel: 'diluição',
    },
  ],
  '3-3': [
    {
      label: 'Original',
      icon: '🩸',
      volume: 500,
      concentration: 80,
      showConc: false,
      color: 'linear-gradient(180deg, #DC2626 0%, #991B1B 100%)',
      soluteDots: 10,
      dotColor: 'rgba(255,255,255,0.95)',
      annotation: '? milhões céls/mL',
    },
    {
      label: 'Diluição 1:10',
      volume: 500,
      concentration: 8,
      showConc: false,
      color: 'linear-gradient(180deg, #F87171 0%, #EF4444 100%)',
      soluteDots: 4,
      dotColor: 'rgba(255,255,255,0.9)',
      annotation: '÷10',
      arrowLabel: '1:10',
    },
    {
      label: 'Diluição 1:100',
      volume: 500,
      concentration: 0.8,
      showConc: false,
      color: 'linear-gradient(180deg, #FEE2E2 0%, #FECACA 100%)',
      soluteDots: 1,
      dotColor: 'rgba(220,38,38,0.85)',
      annotation: '÷10 (total: 1:100)',
      arrowLabel: '1:10',
    },
    {
      label: 'Contagem',
      icon: '🔬',
      volume: 100,
      concentration: 0.8,
      showConc: false,
      color: 'linear-gradient(180deg, #FFEDD5 0%, #FED7AA 100%)',
      soluteDots: 1,
      dotColor: 'rgba(194,65,12,0.85)',
      annotation: '100 células / 10 µL',
      arrowLabel: 'amostra',
    },
  ],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const parseUserAnswer = (input) => {
  const cleaned = input.trim().replace(',', '.');
  const parsed = parseFloat(cleaned);

  if (!cleaned || isNaN(parsed)) {
    return { valid: false, value: null, error: 'Número inválido' };
  }
  if (parsed < 0) {
    return {
      valid: false,
      value: null,
      error: 'Valores negativos não são permitidos',
    };
  }

  return { valid: true, value: parsed, error: null };
};

const validateAnswer = (userAnswer, correctAnswer) => {
  const { valid, value, error } = parseUserAnswer(userAnswer);

  if (!valid) {
    return { valid: false, error };
  }

  const difference = Math.abs(value - correctAnswer);
  const percentageError = (difference / correctAnswer) * 100;
  const isCorrect = difference < GAME_CONSTANTS.ANSWER_TOLERANCE;

  return { valid: true, isCorrect, difference, percentageError, value };
};

const getStabilityChange = (difficulty, isCorrect) => {
  if (isCorrect) {
    return GAME_CONSTANTS.STABILITY_BONUS;
  }
  return -(STABILITY_LOSS_BY_DIFFICULTY[difficulty] || GAME_CONSTANTS.DEFAULT_STABILITY_LOSS);
};

const formatTime = (startTime, endTime) => {
  if (!startTime || !endTime) return '0m 0s';
  const seconds = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const getLiquidColor = (concentration) => {
  if (concentration <= 1) {
    return 'linear-gradient(180deg, #e3f2fd 0%, #90caf9 100%)';
  } else if (concentration <= 5) {
    return 'linear-gradient(180deg, #64b5f6 0%, #2196f3 100%)';
  } else if (concentration <= 10) {
    return 'linear-gradient(180deg, #42a5f5 0%, #1976d2 100%)';
  } else {
    return 'linear-gradient(180deg, #1976d2 0%, #0d47a1 100%)';
  }
};

const getFillHeight = (volume, maxVolume = 500) => {
  return Math.min((volume / maxVolume) * 100, 90);
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const getDotPosition = (i) => ({
  left: `${10 + ((i * 53) % 76)}%`,
  bottom: `${8 + ((i * 31) % 62)}%`,
});
const Beaker = ({ beaker, index }) => {
  if (beaker.isPlaceholder) {
    return (
      <div key={index} style={styles.beakerContainer}>
        <div style={{ fontSize: '30px', color: '#ccc' }}>⋯</div>
        <span style={styles.beakerLabel}>{beaker.label}</span>
      </div>
    );
  }
 
  const fillHeight = getFillHeight(beaker.volume);
  const liquidColor = beaker.color || getLiquidColor(beaker.concentration);
  const dotCount = beaker.soluteDots ?? 0;
  const dotColor = beaker.dotColor || 'rgba(255,255,255,0.85)';
 
  return (
    <div key={index} style={styles.beakerContainer}>
      {beaker.icon && <span style={styles.beakerIcon}>{beaker.icon}</span>}
      {beaker.showConc && (
        <span style={styles.concentrationLabel}>{beaker.concentration}%</span>
      )}
      <div style={styles.beaker}>
        <div
          style={{
            ...styles.beakerLiquid,
            height: `${fillHeight}%`,
            background: liquidColor,
            animation: 'liquidFill 1s ease-out',
            '--fill-height': `${fillHeight}%`,
          }}
        >
          {/* Solute particles — visually separates soluto from solvente */}
          {dotCount > 0 &&
            Array.from({ length: dotCount }).map((_, i) => {
              const pos = getDotPosition(i);
              return (
                <div
                  key={`dot-${i}`}
                  style={{
                    ...styles.soluteDot,
                    left: pos.left,
                    bottom: pos.bottom,
                    background: dotColor,
                    animationDelay: `${(i % 5) * 0.3}s`,
                  }}
                />
              );
            })}
 
          {beaker.volume > 0 && fillHeight > 20 && (
            <>
              <div
                style={{
                  ...styles.bubble,
                  left: '20%',
                  bottom: '10%',
                  animationDelay: '0s',
                }}
              />
              <div
                style={{
                  ...styles.bubble,
                  left: '50%',
                  bottom: '5%',
                  animationDelay: '0.5s',
                }}
              />
              <div
                style={{
                  ...styles.bubble,
                  left: '70%',
                  bottom: '15%',
                  animationDelay: '1s',
                }}
              />
            </>
          )}
        </div>
      </div>
      <span style={styles.beakerLabel}>{beaker.label}</span>
      {beaker.annotation && (
        <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold' }}>
          {beaker.annotation}
        </span>
      )}
    </div>
  );
};

const FlowArrow = ({ label }) => (
  <div style={styles.flowArrowWrap}>
    <span style={styles.flowArrow}>➜</span>
    {label && <span style={styles.flowArrowLabel}>{label}</span>}
  </div>
);
const StatRow = ({ icon, label, value }) => (
  <div style={styles.statRow}>
    <span style={styles.statIcon}>{icon}</span>
    <span style={styles.statText}>
      {label}: {value}
    </span>
  </div>
);

const GameButton = ({ children, variant = 'primary', onClick, disabled, style }) => {
  const buttonStyle =
    variant === 'primary'
      ? styles.btnPrimary
      : variant === 'secondary'
      ? styles.btnSecondary
      : variant === 'action'
      ? styles.btnAction
      : variant === 'forms'
      ? styles.btnForms
      : variant === 'chat'
      ? styles.chatBtn
      : styles.btnPrimary;

  return (
    <button
      style={{ ...buttonStyle, ...style }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
      }}
    >
      {children}
    </button>
  );
};

const NotesPanel = ({ notes, setNotes }) => {
  return (
    <div style={styles.notesPanel}>
      <label style={styles.notesLabel}>📝 Bloco de Notas</label>
      <textarea
        style={styles.notesTextarea}
        placeholder="Escreve aqui os teus cálculos e raciocínio..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
};

const Calculator = ({ show, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op) => {
    const currentValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(currentValue);
    } else if (operation) {
      const result = performOperation(prevValue, currentValue, operation);
      setDisplay(String(result));
      setPrevValue(result);
    }

    setNewNumber(true);
    setOperation(op);
  };

  const performOperation = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return current !== 0 ? prev / current : 0;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (operation && prevValue !== null) {
      const currentValue = parseFloat(display);
      const result = performOperation(prevValue, currentValue, operation);
      setDisplay(String(result));
      setPrevValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  if (!show) return null;

  return (
    <div style={styles.calculatorOverlay} className="calculator">
      <div style={styles.calculatorHeader}>
        <h3 style={{ margin: 0, color: '#4F46E5' }}>🔢 Calculadora</h3>
        <button
          style={styles.calculatorCloseBtn}
          onClick={onClose}
          onMouseEnter={(e) => (e.target.style.color = '#EF4444')}
          onMouseLeave={(e) => (e.target.style.color = '#666')}
        >
          ✕
        </button>
      </div>

      <div style={styles.calculatorDisplay}>{display}</div>

      <div style={styles.calculatorGrid}>
        <button style={styles.calculatorButtonClear} onClick={handleClear}>
          C
        </button>
        <button
          style={styles.calculatorButton}
          onClick={() => setDisplay(String(-parseFloat(display)))}
        >
          +/-
        </button>
        <button
          style={styles.calculatorButton}
          onClick={() => setDisplay(String(parseFloat(display) / 100))}
        >
          %
        </button>
        <button
          style={styles.calculatorButtonOperator}
          onClick={() => handleOperation('÷')}
        >
          ÷
        </button>

        {[7, 8, 9].map((num) => (
          <button
            key={num}
            style={styles.calculatorButton}
            onClick={() => handleNumber(String(num))}
          >
            {num}
          </button>
        ))}
        <button
          style={styles.calculatorButtonOperator}
          onClick={() => handleOperation('×')}
        >
          ×
        </button>

        {[4, 5, 6].map((num) => (
          <button
            key={num}
            style={styles.calculatorButton}
            onClick={() => handleNumber(String(num))}
          >
            {num}
          </button>
        ))}
        <button
          style={styles.calculatorButtonOperator}
          onClick={() => handleOperation('-')}
        >
          -
        </button>

        {[1, 2, 3].map((num) => (
          <button
            key={num}
            style={styles.calculatorButton}
            onClick={() => handleNumber(String(num))}
          >
            {num}
          </button>
        ))}
        <button
          style={styles.calculatorButtonOperator}
          onClick={() => handleOperation('+')}
        >
          +
        </button>

        <button
          style={{ ...styles.calculatorButton, gridColumn: 'span 2' }}
          onClick={() => handleNumber('0')}
        >
          0
        </button>
        <button style={styles.calculatorButton} onClick={handleDecimal}>
          .
        </button>
        <button style={styles.calculatorButtonEquals} onClick={handleEquals}>
          =
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DiluIAGame() {
  // Game state
  const [levelIndex, setLevelIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [userCode, setUserCode] = useState('');
  const [stability, setStability] = useState(100);
  const [xp, setXp] = useState(0);
  const [screen, setScreen] = useState('START');
  const [feedback, setFeedback] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [notes, setNotes] = useState('');

  // UI state
  const [showCalculator, setShowCalculator] = useState(false);

  // LabPartner (AI) usage tracking — key: `${levelId}-${exerciseId}` -> true
  const [aiUsedExercises, setAiUsedExercises] = useState({});

  // Timer state
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const level = levels[levelIndex];
  const exercise = level?.exercises[exerciseIndex];

  // Reset transition state when exercise changes
  useEffect(() => {
    setIsTransitioning(false);
  }, [exerciseIndex, levelIndex]);

  // Handlers
  const openChatbot = () => {
    const exerciseKey = `${level.id}-${exercise.id}`;
    const chatbotUrl = CHATBOT_URLS[exerciseKey];
    window.open(chatbotUrl, 'LabPartner', 'width=500,height=700,left=1000');
    setAiUsedExercises((prev) =>
      prev[exerciseKey] ? prev : { ...prev, [exerciseKey]: true }
    );
  };

  // Builds "Nível 1: 1/3, Nível 2: 3/3, ..." — nº de exercícios de cada
  // nível em que o LabPartner foi consultado pelo menos uma vez.
  const getAiUsageSummary = () =>
    levels
      .map((lvl) => {
        const used = lvl.exercises.filter(
          (ex) => aiUsedExercises[`${lvl.id}-${ex.id}`]
        ).length;
        return `Nível ${lvl.id}: ${used}/${lvl.exercises.length}`;
      })
      .join(', ');

  
  const openCodeChatbot = () => {
    window.open(CODE_CHATBOT_URL, 'LabPartner', 'width=500,height=700,left=1000');
  };


  const handleSubmit = () => {
    if (!userAnswer || isTransitioning) return;

    const validation = validateAnswer(userAnswer, exercise.correct);

    if (!validation.valid) {
      setFeedback({
        type: 'error',
        msg: `❌ ${validation.error}`,
      });
      return;
    }

    const stabilityChange = getStabilityChange(
      exercise.difficulty,
      validation.isCorrect
    );

    if (validation.isCorrect) {
      setStability((prev) =>
        Math.min(GAME_CONSTANTS.MAX_STABILITY, prev + stabilityChange)
      );
      setXp((prev) => prev + exercise.xp);
      setFeedback({
        type: 'success',
        msg: `✅ Correto! Mistura estabilizada. (+${exercise.xp} XP, +${stabilityChange}% estabilidade)`,
      });
      setIsTransitioning(true);

      setTimeout(() => {
        setFeedback(null);
        setUserAnswer('');
        setNotes('');
        if (exerciseIndex + 1 < level.exercises.length) {
          setExerciseIndex((prev) => prev + 1);
        } else {
          setEndTime(Date.now());
          setScreen('CODE');
        }
      }, GAME_CONSTANTS.TRANSITION_DELAY);
    } else {
      const newStability = Math.max(
        GAME_CONSTANTS.MIN_STABILITY,
        stability + stabilityChange
      );
      setStability(newStability);
      setFeedback({
        type: 'error',
        msg: `❌ Instável! Verifica os cálculos ou pede ajuda ao LabPartner! (${stabilityChange}% estabilidade)`,
      });

      if (newStability <= 0) {
        setEndTime(Date.now());
        setTimeout(() => setScreen('GAMEOVER'), GAME_CONSTANTS.GAMEOVER_DELAY);
      }
    }
  };

  const handleCodeSubmit = () => {
    if (!userCode) return;

    const cod = userCode.trim();
    if (cod === level.levelcode) {
      if (levelIndex < levels.length - 1) {
        setFeedback({ type: 'success', msg: '✅ Código correto! A avançar...' });
        setTimeout(() => {
          setScreen('GAME');
          setFeedback(null);
          setUserAnswer('');
          setNotes('');
          setUserCode('');
          setLevelIndex((prev) => prev + 1);
          setExerciseIndex(0);
        }, GAME_CONSTANTS.CODE_TRANSITION_DELAY);
      } else {
        setEndTime(Date.now());
        setScreen('VICTORY');
      }
    } else {
      setFeedback({ type: 'error', msg: '❌ Código errado. Tenta novamente.' });
    }
  };

  const getBeakerVisualization = () => {
    const key = `${level.id}-${exercise.id}`;
    const beakers = BEAKER_CONFIGS[key] || [
      { label: 'Solução', volume: 300, concentration: 5, showConc: true },
    ];
    const elements = [];
    beakers.forEach((beaker, index) => {
      if (index > 0) {
        elements.push(
          <FlowArrow key={`arrow-${index}`} label={beaker.arrowLabel} />
        );
      }
      elements.push(<Beaker key={index} beaker={beaker} index={index} />);
    });
    return elements;
  };

  const copyResults = (text) => {
    navigator.clipboard.writeText(text);
    alert('📋 Resultados copiados! Partilha os teus resultados!');
  };

  // ============================================================================
  // RENDER SCREENS
  // ============================================================================

  // START SCREEN
  if (screen === 'START') {
    return (
      <div style={styles.container}>
        <style>{CSS_ANIMATIONS}</style>
        <div style={styles.card}>
          <div style={{ fontSize: '60px', animation: 'bounce 2s infinite' }}>
            ⚗️
          </div>
          <h1 style={styles.title}>DILU-IA</h1>
          <p style={styles.text}>Crise no Laboratório: Salva as soluções!</p>

          <div style={styles.infoBox}>
            <p>
              🤖 <strong>Dica:</strong> Usa o botão "LabPartner AI" para abrir o
              teu assistente inteligente numa janela ao lado.
            </p>
          </div>

          <GameButton
            variant="primary"
            onClick={() => {
              setScreen('GAME');
              setStartTime(Date.now());
            }}
          >
            ENTRAR NO LABORATÓRIO
          </GameButton>
        </div>
      </div>
    );
  }

  // VICTORY SCREEN
  if (screen === 'VICTORY') {
    const timeString = formatTime(startTime, endTime);
    const aiSummary = getAiUsageSummary();
    const shareText = `🎉 DILU-IA - Laboratório Salvo!\n\n📊 Resultados:\n✨ XP Total: ${xp}\n🏆 Rank: ${level.rank}\n⚗️ Estabilidade Final: ${stability}%\n⏱️ Tempo: ${timeString}\n🤖 Uso do LabPartner: ${aiSummary}\n\n#DiluIA #QuímicaGame`;
 
    return (
      <div style={styles.container}>
        <style>{CSS_ANIMATIONS}</style>
        <div style={styles.card}>
          <div
            style={{ fontSize: '60px', animation: 'celebrate 1s ease-in-out infinite' }}
          >
            🎉
          </div>
          <h1 style={{ ...styles.title, color: '#10B981' }}>Laboratório Salvo!</h1>
          <p style={styles.text}>Parabéns, {level.rank}!</p>
 
          <div style={styles.statsBlock}>
            <StatRow icon="✨" label="XP Total" value={xp} />
            <StatRow icon="🏆" label="Rank" value={level.rank} />
            <StatRow icon="⚗️" label="Estabilidade Final" value={`${stability}%`} />
            <StatRow icon="⏱️" label="Tempo" value={timeString} />
            <StatRow icon="🤖" label="Uso do LabPartner" value={aiSummary} />
          </div>
 
          <GameButton
            variant="secondary"
            onClick={() => copyResults(shareText)}
            style={{ marginBottom: '10px' }}
          >
            📋 COPIAR RESULTADOS
          </GameButton>
 
          <GameButton variant="primary" onClick={() => window.location.reload()}>
            JOGAR NOVAMENTE
          </GameButton>
        </div>
      </div>
    );
  }

  // GAMEOVER SCREEN
  if (screen === 'GAMEOVER') {
    const timeString = formatTime(startTime, endTime);
    const aiSummary = getAiUsageSummary();
    const shareText = `💥 DILU-IA - Explosão no Lab!\n\n📊 Resultados:\n✨ XP: ${xp}\n🏆 Rank: ${level.rank}\n⚗️ Estabilidade Final: ${stability}%\n⏱️ Tempo: ${timeString}\n🤖 Uso do LabPartner: ${aiSummary}\n\n#DiluIA #QuímicaGame`;
 
    return (
      <div style={styles.container}>
        <style>{CSS_ANIMATIONS}</style>
        <div style={styles.card}>
          <div
            style={{ fontSize: '60px', animation: 'shake 0.5s ease-in-out infinite' }}
          >
            💥
          </div>
          <h1 style={{ ...styles.title, color: '#EF4444' }}>Explosão!</h1>
          <p style={styles.text}>A estabilidade chegou a 0%.</p>
 
          <div style={styles.statsBlock}>
            <StatRow icon="✨" label="XP" value={xp} />
            <StatRow icon="🏆" label="Rank" value={level.rank} />
            <StatRow icon="⚗️" label="Estabilidade Final" value={`${stability}%`} />
            <StatRow icon="⏱️" label="Tempo" value={timeString} />
            <StatRow icon="🤖" label="Uso do LabPartner" value={aiSummary} />
          </div>
 
          <GameButton
            variant="secondary"
            onClick={() => copyResults(shareText)}
            style={{ marginBottom: '10px' }}
          >
            📋 COPIAR RESULTADOS
          </GameButton>
 
          <GameButton variant="secondary" onClick={() => window.location.reload()}>
            TENTAR DE NOVO
          </GameButton>
        </div>
      </div>
    );
  }

  // CODE SCREEN
  if (screen === 'CODE') {
    return (
      <div style={styles.container}>
        <style>{CSS_ANIMATIONS}</style>
        <div style={styles.card}>
          <div
            style={{ fontSize: '60px', animation: 'pulse 2s ease-in-out infinite' }}
          >
            🤖
          </div>
          <p style={styles.text}>Estás a chegar ao final do nível {level.id}!</p>
          <p style={styles.text}>Conversa com o LabPartner para poderes avançar.</p>

          <GameButton
            variant="chat"
            onClick={openCodeChatbot}
            style={{ marginBottom: '16px' }}
          >
            🤖 Falar com LabPartner AI
          </GameButton>

          <div style={styles.inputWrapper}>
            <input
              style={styles.realInput}
              placeholder="Código do LabPartner"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
            />
          </div>

          <GameButton variant="secondary" onClick={handleCodeSubmit}>
            SUBMETER
          </GameButton>

          {feedback && (
            <div
              style={{
                ...styles.feedbackBox,
                background: feedback.type === 'success' ? '#D1FAE5' : '#FEE2E2',
                color: feedback.type === 'success' ? '#065F46' : '#991B1B',
              }}
            >
              {feedback.msg}
            </div>
          )}
        </div>
      </div>
    );
  }

  // GAME SCREEN
  return (
    <div style={styles.gameLayout} className="game-layout">
      <style>{CSS_ANIMATIONS}</style>

      {/* SIDEBAR */}
      <div style={styles.sidebar} className="sidebar">
        <div>
          <h2 style={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
          DILU-IA ⚗️
          </h2>

          <p style={{ fontSize: '12px', color: '#ccc', marginBottom: '10px' }}>
            Usa as ferramentas ao lado!
          </p>
          </div>

        <div style={{ marginTop: '10px' }}>
          <GameButton
            variant="chat"
            onClick={() => setShowCalculator(!showCalculator)}
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            }}
          >
            🔢 {showCalculator ? 'Fechar' : 'Abrir'} Calculadora
          </GameButton>
        </div>

        <div style={{ ...styles.statBox, marginTop: 'auto' }}>
          <label style={styles.statLabel}>RANK</label>
          <div style={{ fontWeight: 'bold' }}>{level.rank}</div>
        </div>

        <div style={styles.statBox}>
          <label style={styles.statLabel}>XP</label>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FCD34D' }}>
            {xp}
          </div>
        </div>

        <div style={styles.statBox}>
          <label style={styles.statLabel}>ESTABILIDADE DO LAB</label>
          <div style={styles.barContainer}>
            <div
              style={{
                ...styles.barFill,
                width: `${stability}%`,
                backgroundColor: stability > 50 ? '#10B981' : '#EF4444',
              }}
            ></div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', marginTop: '5px' }}>
            {stability}%
          </div>
        </div>
      </div>

      {/* MAIN AREA */}
      <div style={styles.mainArea} className="main-area">
        <div style={styles.header}>
          <h2>
            Nível {level.id}: {exercise.title}
          </h2>
          <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '5px' }}>
            📊 Exercício {exerciseIndex + 1} de {level.exercises.length} | 🎯 Rank:{' '}
            {level.rank} | ⚡ +{exercise.xp} XP
          </div>
        </div>

        <div style={styles.labCard} className="lab-card">
          {!exercise.formulaVisible && (
            <div style={styles.retrievalBadge}>
              🧠 RETRIEVAL PRACTICE: Fórmula Oculta!
            </div>
          )}

          <p style={styles.storyText} className="story-text">
            {exercise.story}
          </p>

          {/* Visual Area */}
          <div style={styles.visualArea} className="visual-area">
            {getBeakerVisualization()}
          </div>

          {/* Formula */}
          <div style={styles.formulaBox}>
            {exercise.formulaVisible
              ? `Fórmula: ${exercise.formula}`
              : '⚠️ Tenta recordar a fórmula!'}
          </div>
          
          <NotesPanel notes={notes} setNotes={setNotes} />

          {/* Inputs */}
          <div style={styles.inputGrid} className="input-grid">
            {exercise.inputs.map((inp, idx) => (
              <div key={idx} style={styles.inputWrapper}>
                <label style={styles.label}>{inp.label}</label>
                <div style={styles.fakeInput}>{inp.value}</div>
              </div>
            ))}

            <div style={{ ...styles.inputWrapper, gridColumn: 'span 2' }}>
              <label style={{ ...styles.label, color: '#4F46E5' }}>
                🧪 {exercise.targetLabel}
              </label>
              <input
                type="number"
                style={styles.realInput}
                placeholder="?"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          <GameButton
            variant="chat"
            onClick={openChatbot}
            style={{ marginBottom: '16px' }}
          >
            🤖 Falar com LabPartner AI sobre o exercício {exercise.id} 🤖
          </GameButton>

          <GameButton
            variant="action"
            onClick={handleSubmit}
            disabled={isTransitioning}
            style={{
              opacity: isTransitioning ? 0.6 : 1,
              cursor: isTransitioning ? 'not-allowed' : 'pointer',
            }}
          >
            {isTransitioning ? 'PROCESSANDO...' : 'MISTURAR / SUBMETER'}
          </GameButton>

          {feedback && (
            <div
              style={{
                ...styles.feedbackBox,
                background: feedback.type === 'success' ? '#D1FAE5' : '#FEE2E2',
                color: feedback.type === 'success' ? '#065F46' : '#991B1B',
              }}
            >
              {feedback.msg}
            </div>
          )}
        </div>
      </div>

      {/* Calculator Overlay */}
      <Calculator show={showCalculator} onClose={() => setShowCalculator(false)} />
    </div>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#1F2937',
    padding: '20px',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  gameLayout: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    maxWidth: '1600px',
    margin: '0 auto',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    overflow: 'hidden',
  },
  sidebar: {
    width: 'clamp(260px, 22vw, 320px)',
    minWidth: '260px',
    background: 'linear-gradient(180deg, #312E81 0%, #1E3A8A 100%)',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
    zIndex: 10,
    overflowY: 'auto',
    minHeight: 0,
    position: 'relative',
  },
  mainArea: {
    flex: 1,
    background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    padding: 'clamp(20px, 5vw, 40px)',
    overflowY: 'auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    background: 'white',
    padding: 'clamp(24px, 6vw, 48px)',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    textAlign: 'center',
    maxWidth: '560px',
    width: '100%',
    animation: 'fadeIn 0.5s ease-in',
  },
  labCard: {
    background: 'white',
    padding: 'clamp(20px, 4vw, 32px)',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '900px',
    position: 'relative',
    animation: 'fadeIn 0.5s ease-in',
  },
  title: {
    color: '#312E81',
    margin: '16px 0',
    fontSize: 'clamp(28px, 5vw, 40px)',
    fontWeight: '800',
    letterSpacing: '-0.02em',
  },
  text: {
    color: '#6B7280',
    fontSize: 'clamp(16px, 3vw, 18px)',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  infoBox: {
    background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    padding: '20px',
    borderRadius: '16px',
    textAlign: 'left',
    fontSize: '14px',
    marginBottom: '24px',
    color: '#1E40AF',
    border: '2px solid #93C5FD',
  },
  header: {
    marginBottom: '24px',
    color: '#1E40AF',
    textAlign: 'center',
    width: '100%',
  },
  statBox: {
    background: 'rgba(255,255,255,0.15)',
    padding: '14px',
    borderRadius: '12px',
    marginBottom: '10px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  statLabel: {
    fontSize: '10px',
    opacity: 0.8,
    letterSpacing: '1.5px',
    display: 'block',
    marginBottom: '8px',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  barContainer: {
    height: '12px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
  },
  barFill: {
    height: '100%',
    transition: 'width 0.5s ease, background-color 0.3s ease',
    boxShadow: '0 0 10px rgba(255,255,255,0.5)',
    borderRadius: '6px',
  },
  chatBtn: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  storyText: {
    fontSize: 'clamp(15px, 2.5vw, 18px)',
    lineHeight: '1.7',
    color: '#374151',
    marginBottom: '24px',
    textAlign: 'left',
  },
  visualArea: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    gap: 'clamp(12px, 3vw, 24px)',
    padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)',
    background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)',
    borderRadius: '16px',
    marginBottom: '20px',
    border: '2px solid #E5E7EB',
    minHeight: '180px',
    flexWrap: 'wrap',
  },
  beakerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    gap: '8px',
  },
  beaker: {
    width: '70px',
    height: '120px',
    background: 'rgba(255,255,255,0.4)',
    border: '3px solid #374151',
    borderTop: '3px solid #6B7280',
    borderRadius: '0 0 16px 16px',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.1)',
  },
  beakerLiquid: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: '0 0 13px 13px',
    transition: 'height 0.8s ease-out',
  },
  beakerLabel: {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  concentrationLabel: {
    position: 'absolute',
    top: '-28px',
    fontSize: '11px',
    background: 'white',
    padding: '4px 10px',
    borderRadius: '12px',
    border: '2px solid #E5E7EB',
    fontWeight: '700',
    color: '#4F46E5',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  soluteDot: {
    position: 'absolute',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    boxShadow: '0 0 2px rgba(0,0,0,0.3)',
    animation: 'dotDrift 3s ease-in-out infinite',
  },
  beakerIcon: {
    fontSize: '16px',
    lineHeight: 1,
  },
  flowArrowWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '120px',
    paddingBottom: '8px',
    gap: '2px',
  },
  flowArrow: {
    fontSize: '22px',
    color: '#9CA3AF',
  },
  flowArrowLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#9CA3AF',
    whiteSpace: 'nowrap',
  },
  formulaBox: {
    textAlign: 'center',
    padding: 'clamp(12px, 2vw, 16px)',
    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    border: '2px solid #F59E0B',
    color: '#92400E',
    borderRadius: '12px',
    marginBottom: '20px',
    fontFamily: "'Fira Code', 'Courier New', monospace",
    fontWeight: '600',
    fontSize: 'clamp(12px, 2vw, 15px)',
  },
  retrievalBadge: {
    position: 'absolute',
    top: '-12px',
    right: '-12px',
    background: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
    color: 'white',
    padding: '10px 18px',
    borderRadius: '24px',
    fontSize: '11px',
    fontWeight: '700',
    boxShadow: '0 4px 15px rgba(168,85,247,0.4)',
    zIndex: 1,
    letterSpacing: '0.5px',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '14px',
    marginBottom: '20px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: '0.5px',
  },
  fakeInput: {
    background: '#F3F4F6',
    padding: '14px',
    borderRadius: '10px',
    color: '#374151',
    fontFamily: "'Fira Code', monospace",
    fontSize: '16px',
    fontWeight: '600',
    border: '2px solid #E5E7EB',
  },
  realInput: {
    padding: '14px',
    borderRadius: '10px',
    border: '2px solid #4F46E5',
    fontSize: '18px',
    fontWeight: '700',
    textAlign: 'center',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    fontFamily: "'Fira Code', monospace",
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    fontSize: 'clamp(16px, 3vw, 18px)',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(79,70,229,0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    width: '100%',
  },
  btnSecondary: {
    marginTop: '12px',
    background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    fontSize: 'clamp(16px, 3vw, 18px)',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(107,114,128,0.3)',
    transition: 'transform 0.2s',
    width: '100%',
  },
  btnAction: {
    width: '100%',
    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    color: 'white',
    border: 'none',
    padding: '18px',
    borderRadius: '12px',
    fontSize: 'clamp(15px, 2.5vw, 17px)',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(99,102,241,0.3)',
    transition: 'transform 0.1s',
  },
  feedbackBox: {
    marginTop: '20px',
    padding: '16px',
    borderRadius: '12px',
    fontWeight: '600',
    textAlign: 'center',
    animation: 'fadeIn 0.3s ease-in',
    border: '2px solid',
    borderColor: 'currentColor',
  },
  bubble: {
    position: 'absolute',
    width: '8px',
    height: '8px',
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '50%',
    animation: 'bubbles 2s infinite',
  },
  calculatorOverlay: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    transform: 'none',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
    padding: '20px',
    zIndex: 1001,
    width: 'clamp(280px, 85vw, 320px)',
    maxHeight: 'calc(100vh - 40px)',
    overflowY: 'auto',
    animation: 'fadeIn 0.3s ease-in',
  },
  calculatorDisplay: {
    background: '#F3F4F6',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '16px',
    textAlign: 'right',
    fontSize: 'clamp(22px, 5vw, 28px)',
    fontFamily: "'Fira Code', monospace",
    fontWeight: '700',
    minHeight: '60px',
    wordBreak: 'break-all',
    border: '2px solid #E5E7EB',
    color: '#1F2937',
  },
  calculatorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'clamp(8px, 2vw, 12px)',
  },
  calculatorButton: {
    padding: 'clamp(16px, 3vw, 20px)',
    fontSize: 'clamp(16px, 3vw, 20px)',
    fontWeight: '700',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#EFF6FF',
    color: '#1E40AF',
  },
  calculatorButtonOperator: {
    padding: 'clamp(16px, 3vw, 20px)',
    fontSize: 'clamp(16px, 3vw, 20px)',
    fontWeight: '700',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#F59E0B',
    color: 'white',
  },
  calculatorButtonEquals: {
    padding: 'clamp(16px, 3vw, 20px)',
    fontSize: 'clamp(16px, 3vw, 20px)',
    fontWeight: '700',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#10B981',
    color: 'white',
    gridColumn: 'span 2',
  },
  calculatorButtonClear: {
    padding: 'clamp(16px, 3vw, 20px)',
    fontSize: 'clamp(16px, 3vw, 20px)',
    fontWeight: '700',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#EF4444',
    color: 'white',
  },
  calculatorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #E5E7EB',
  },
  calculatorCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6B7280',
    padding: '4px',
    lineHeight: 1,
  },
  statsBlock: {
    background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
    padding: '20px',
    borderRadius: '16px',
    marginBottom: '20px',
    border: '2px solid #E5E7EB',
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    marginBottom: '8px',
    background: 'white',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  statIcon: {
    fontSize: '20px',
    marginRight: '12px',
    minWidth: '28px',
  },
  statText: {
    color: '#1F2937',
    flex: 1,
  },

  notesPanel: {
    background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    padding: 'clamp(12px, 2vw, 16px)',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '2px solid #F59E0B',
  },
  notesLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '700',
    color: '#92400E',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  notesTextarea: {
    width: '98%',
    minHeight: 'clamp(80px, 15vw, 100px)',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #FCD34D',
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    resize: 'vertical',
    outline: 'none',
    background: 'white',
    color: '#1F2937',              // ✅ ADD THIS
    WebkitTextFillColor: '#1F2937', // ✅ ADD THIS  
    colorScheme: 'light',        
  },
};

// ============================================================================
// CSS ANIMATIONS
// ============================================================================

const CSS_ANIMATIONS = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  @keyframes liquidFill {
    from { height: 0%; opacity: 0; }
    to { height: var(--fill-height); opacity: 0.85; }
  }

  @keyframes dotDrift {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(2px, -3px); }
  }
  
  @keyframes celebrate {
    0% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.15) rotate(-8deg); }
    50% { transform: scale(1.25) rotate(8deg); }
    75% { transform: scale(1.15) rotate(-8deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
  
  @keyframes bubbles {
    0% { transform: translateY(0) scale(1); opacity: 0.8; }
    100% { transform: translateY(-35px) scale(1.6); opacity: 0; }
  }
  
  /* ============================================
     RESPONSIVE BREAKPOINTS
     ============================================ */
  
  /* TABLET (768px - 1024px) */
  @media (max-width: 1024px) {
    .game-layout {
      flex-direction: column !important;
    }
    
    .sidebar {
      width: 100% !important;
      min-width: auto !important;
      max-height: 200px !important;
      flex-direction: row !important;
      flex-wrap: wrap !important;
      gap: 8px !important;
      padding: 16px !important;
      overflow-x: auto !important;
    }
    
    .main-area {
      padding: 20px !important;
    }
    
    .calculator {
      top: 10px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 90% !important;
      max-width: 340px !important;
    }
  }
  
  /* MOBILE (< 768px) */
  @media (max-width: 768px) {
    .input-grid {
      grid-template-columns: 1fr !important;
    }
    
    .visual-area {
      flex-direction: row !important;
      justify-content: center !important;
      gap: 12px !important;
      padding: 16px !important;
      min-height: 150px !important;
    }
    
    .beaker-container {
      transform: scale(0.9);
    }
    
    .sidebar {
      max-height: none !important;
      flex-direction: column !important;
      gap: 10px !important;
    }
    
    .lab-card {
      padding: 20px !important;
    }
    
    .story-text {
      font-size: 15px !important;
    }
  }
  
  /* SMALL MOBILE (< 480px) */
  @media (max-width: 480px) {
    .visual-area {
      flex-wrap: wrap !important;
      gap: 8px !important;
    }
    
    .beaker-container {
      transform: scale(0.8);
    }
    
    .calculator {
      width: 95% !important;
      padding: 16px !important;
    }
  }
`;