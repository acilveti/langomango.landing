// Define types for book content
interface Segment {
  text: string;
  translationKey?: string;
  showTranslation?: boolean;
}

interface Paragraph {
  segments: Segment[];
  indent: boolean;
}

interface PageContent {
  paragraphs: Paragraph[];
}

interface BookContent {
  [pageNumber: number]: PageContent;
}
// Book content for WORDS ONLY (A1, A2, or unset)
export const bookContentWords: BookContent = {
  8: {
    paragraphs: [
      {
        segments: [
          {
            text: 'He opened his',
          },
          {
            text: ' eyes',
            translationKey: 'eyes',
            showTranslation: true,
          },
          {
            text: ' and found himself facing the boatswain who, a few inches away and with water running down his face.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'The',
          },
          {
            text: ' storm',
            translationKey: 'storm',
            showTranslation: true,
          },
          {
            text: ' had grown worse during the night, and the waves crashed over the deck with tremendous force.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'Joan struggled to his',
          },
          {
            text: ' feet',
            translationKey: 'feet',
            showTranslation: true,
          },
          {
            text: ', his body aching from being thrown against the bulkhead.',
          },
        ],
        indent: true,
      },
    ],
  },
  9: {
    paragraphs: [
      {
        segments: [
          {
            text: 'The',
          },
          {
            text: ' deck',
            translationKey: 'deck',
            showTranslation: true,
          },
          {
            text: ' was chaos. Men ran in all directions, some trying to secure loose cargo while others fought to control the sails.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'Through the spray and',
          },
          {
            text: ' darkness',
            translationKey: 'darkness',
            showTranslation: true,
          },
          {
            text: ', Joan could barely make out the torn mainsail flapping wildly in the wind like a wounded bird.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'The',
          },
          {
            text: ' ship',
            translationKey: 'ship',
            showTranslation: true,
          },
          {
            text: ' groaned under the assault of wind and waves.',
          },
        ],
        indent: true,
      },
    ],
  },
  10: {
    paragraphs: [
      {
        segments: [
          {
            text: 'Lightning',
            translationKey: 'lightning',
            showTranslation: true,
          },
          {
            text: ' split the sky, illuminating the mountainous waves that surrounded them.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'The',
          },
          {
            text: ' captain',
            translationKey: 'captain',
            showTranslation: true,
          },
          {
            text: ' appeared on deck, his weathered face grim but determined.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: '"All hands on',
          },
          {
            text: ' deck',
            translationKey: 'deck',
            showTranslation: true,
          },
          {
            text: '!" he roared, and even the most exhausted sailors found new strength.',
          },
        ],
        indent: true,
      },
    ],
  },
  11: {
    paragraphs: [
      {
        segments: [
          {
            text: 'Joan grabbed a',
          },
          {
            text: ' rope',
            translationKey: 'rope',
            showTranslation: true,
          },
          {
            text: ' and joined the others in securing the cargo.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'A massive',
          },
          {
            text: ' wave',
            translationKey: 'wave',
            showTranslation: true,
          },
          {
            text: ' crashed over the bow, sending torrents of seawater across the deck.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'Time',
            translationKey: 'time',
            showTranslation: true,
          },
          {
            text: ' seemed to slow as Joan watched a young sailor lose his grip and begin sliding toward the rails.',
          },
        ],
        indent: true,
      },
    ],
  },
};

// Book content for SENTENCES (B1, B2, C1, C2)
export const bookContentSentences: BookContent = {
  8: {
    paragraphs: [
      {
        segments: [
          {
            text: 'He opened his eyes',
            translationKey: 'He opened his eyes',
            showTranslation: true,
          },
          {
            text: ' and found himself facing the boatswain who, a few inches away and with water running down his face, was shouting at him at the top of his lungs.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'The',
          },
          {
            text: ' storm',
            translationKey: 'storm',
            showTranslation: true,
          },
          {
            text: ' had grown worse during the night, and the waves crashed over the deck with tremendous force.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'Joan struggled to his feet',
            translationKey: 'Joan struggled to his feet',
            showTranslation: true,
          },
          {
            text: ', his body aching from being thrown against the bulkhead.',
          },
        ],
        indent: true,
      },
    ],
  },
  9: {
    paragraphs: [
      {
        segments: [
          {
            text: 'The deck was chaos',
            translationKey: 'The deck was chaos',
            showTranslation: true,
          },
          {
            text: '. Men ran in all directions, some trying to secure loose cargo while others fought to control the sails.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'Through the spray and',
          },
          {
            text: ' darkness',
            translationKey: 'darkness',
            showTranslation: true,
          },
          {
            text: ', Joan could barely make out the torn mainsail flapping wildly in the wind like a wounded bird.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'The',
          },
          {
            text: ' ship',
            translationKey: 'ship',
            showTranslation: true,
          },
          {
            text: ' groaned under the assault of wind and waves, its timbers creaking ominously.',
          },
        ],
        indent: true,
      },
    ],
  },
  10: {
    paragraphs: [
      {
        segments: [
          {
            text: 'Lightning split the sky',
            translationKey: 'Lightning split the sky',
            showTranslation: true,
          },
          {
            text: ', illuminating the mountainous waves that surrounded them.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'The',
          },
          {
            text: ' captain',
            translationKey: 'captain',
            showTranslation: true,
          },
          {
            text: ' appeared on deck, his weathered face grim but determined.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: '"All hands on deck!"',
            translationKey: '"All hands on deck!"',
            showTranslation: true,
          },
          {
            text: ' he roared, and even the most exhausted sailors found new strength.',
          },
        ],
        indent: true,
      },
    ],
  },
  11: {
    paragraphs: [
      {
        segments: [
          {
            text: 'Joan grabbed a rope',
            translationKey: 'Joan grabbed a rope',
            showTranslation: true,
          },
          {
            text: ' and joined the others in securing the cargo.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'A massive',
          },
          {
            text: ' wave',
            translationKey: 'wave',
            showTranslation: true,
          },
          {
            text: ' crashed over the bow, sending torrents of seawater across the deck.',
          },
        ],
        indent: true,
      },
      {
        segments: [
          {
            text: 'Time seemed to slow',
            translationKey: 'Time seemed to slow',
            showTranslation: true,
          },
          {
            text: ' as Joan watched a young sailor lose his grip and begin sliding toward the rails.',
          },
        ],
        indent: true,
      },
    ],
  },
};
